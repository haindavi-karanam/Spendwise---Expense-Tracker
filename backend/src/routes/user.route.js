import express from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";
import userMiddleware from "../middleware/user.middleware.js";;
import User from "../models/user.model.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);


authRoutes.get("/me", userMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

export default authRoutes;