const express = require('express');
const { auth } = require('express-openid-connect');
const bodyParser = require('body-parser');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
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

app.post('/donor', (req, res) => {
    client.messages
  .create({
     body: `Patient blood group: ${req.body.bloodType} \nPlease call: ${req.body.phoneNumber}`,
     from: '+16088892798',
     to: '+12368623321'
   })
  .then(message => console.log(message.sid));
  // res.send({"status":"All suitable donors have been notified"});
  res.render('notified.ejs', {
        root: '\views', 
        title: "BludBud", 
        isAuthenticated: req.oidc.isAuthenticated()})
  });

app.listen(3000, () => {
    console.log('Server started on port 3000');
});