import mongoose from "mongoose";
import internal from "stream";
const { Schema, model } = mongoose;

const userSchema = new Schema({
    userFirstName: String,
    userLastName: String,
    userEmail: String,
    userPhone: String,
    userBloodType: String,
    userDistance: Number,
    userVisits: { type: Number, default: 0 }
})