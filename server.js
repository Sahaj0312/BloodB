const express = require('express');
const { auth } = require('express-openid-connect');
const bodyParser = require('body-parser');
const sqlite3 = require("sqlite3").verbose();
require('dotenv').config();

const accountSid = 'AC8ac870db979e2c680690a5d3bda3dd11';
const authToken = 'e7453da6f298b315f9c3c7ce3b51d714';
const client = require('twilio')(accountSid, authToken);

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUERBASEURL
  };

const app = express();

app.set("view engine", "html");
app.use(auth(config));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const db_name = 'data/donor.db'
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'donor.db'");
});

const sql_create = `CREATE TABLE IF NOT EXISTS Donor (
    Name VARCHAR(100) NOT NULL,
    BloodType VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(100) PRIMARY KEY
  );`;
  
  db.run(sql_create, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful creation of the 'Donor' table");
  });


app.get('/', (req, res) => {
    // res.send('Hello World!');
    console.log(req.oidc.isAuthenticated());
    res.render('index.ejs', { 
        root: '\views', 
        title: "BludBud",
        isAuthenticated: req.oidc.isAuthenticated()})
});

app.get('/donor', (req, res) => {
    // res.send('Hello World!');
    res.render('donor.ejs', { 
        root: '\views', 
        title: "BludBud",
        isAuthenticated: req.oidc.isAuthenticated()})
});

app.post('/thankYou', (req,res) => {
    const sql = "INSERT INTO Donor (Name, BloodType, PhoneNumber) VALUES (?, ?, ?)";
    const donor = [req.body.governmentName, req.body.bloodType, req.body.phoneNumber];
    db.run(sql, donor, err => {
        if (err) {
            res.status(404).json({"status": "Sorry, this number is already taken!" });
            return;
        }
        res.send({"status":`Thank you ${req.body.governmentName} for registering!`});
      });
}) 

app.post('/donor', async (req, res) => {
    const bloodType = req.body.bloodType
    numberz = await query(bloodType,"SELECT * FROM Donor WHERE BloodType = ?")
    console.log(numberz[0].PhoneNumber)
    await message(numberz[0].PhoneNumber,bloodType,req.body.phoneNumber)
        .then(res.send({"status":`All suitable donors have been notified`}));
  });

  async function message(number,bType,pn) {
    client.messages
      .create({
         body: `URGENT! BLOOD REQUIRED: \nPatient blood group: ${bType} \nPlease call: ${pn}`,
         from: '+16088892798',
         to: number
       })
      .then(message => console.log(message.sid));

  }

  async function query(bloodType,sql) {
    return new Promise(function (resolve,reject) {
        db.all(sql, bloodType, (err, rows) => {
            if (err) {
              return reject(err.message);
            }
            resolve(rows);
        });

    })
  }

app.listen(3000, () => {
    console.log('Server started on port 3000');
});