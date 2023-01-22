import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
    userID: String,
    userFirstName: String,
    userLastName: String,
    userEmail: String,
    userPhone: String,
    userBloodType: String,
    userDistance: Number,
    },
    {
    collection: 'BludBud.users'
    });

const User = mongoose.model('User', userSchema);
export default User;