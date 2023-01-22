// const mongoose = require('mongoose')
import mongoose from "mongoose";

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