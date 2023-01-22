const express = require('express');
const { auth } = require('express-openid-connect');
require('dotenv').config();

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


app.get('/', (req, res) => {
    // res.send('Hello World!');
    console.log(req.oidc.isAuthenticated());
    res.render('index.ejs', { 
        root: '\views', 
        title: "BludBud",
        isAuthenticated: req.oidc.isAuthenticated()})

    
        
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});