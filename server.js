import mongoose from 'mongoose';
import User from './model/User.js'
import express from 'express';
import { auth } from 'express-openid-connect';
import {} from 'dotenv/config';
// const express = require('express');
// const { auth } = require('express-openid-connect');
// const User = require('./model/User.js');
// const mongoose = require('mongoose');
// require('dotenv').config();


const url = `mongodb+srv://yajasmalhotra:shredder0210@cluster0.fwyxegv.mongodb.net/?retryWrites=true&w=majority`;

const connectionParams={
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })

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

var reqGlobal;

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

app.get('/', (req, res) => {
    const newUser = new User ({
        userID: req.oidc.userID,
        userFirstName: req.oidc.given_name,
        userLastName: req.oidc.family_name,
        userEmail: req.oidc.email,
        // userPhone: "7786362172",
        // userBloodType: "B+",
        // userDistance: 1
    });
newUser.save();
});