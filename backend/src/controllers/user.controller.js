import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


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

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // 2. Find user
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 3. Compare passwords
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 4. Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        // 5. Send response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
