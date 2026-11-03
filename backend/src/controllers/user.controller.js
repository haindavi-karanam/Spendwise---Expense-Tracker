import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const registerUser = async(req, res)=>{
    try{
        const { name, email, password} =req.body;

        if(!name || !email ||!password){
            return res.status(400).json({
                message: "ALl feilds are required",
                success: false
            });
        }
        //existing user
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });
        if(existingUser){

            return res.status(409).json({
                message: "Email already exists",
                success: false
            });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create user
        const user = await User.create({
            name, email, password: hashedPassword
        });


        res.status(200).json({
            message:"User registered successfully",
            success: true,
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    }catch(err){

        /*
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }
        */
         res.status(500).json({
            success: false,
            message: "Internal server error"
         });
    }
}