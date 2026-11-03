import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required : true,
        
    },
    email :{
        required : true,
        type : String,
        unique: true,
        trim: true,
        lowercase: true
    },
    password:{
        required: true,
        type: String,
        minLength: 8
    }
},
{
    timestamps : true
});



const User = mongoose.model("USer", userSchema);

export default User;