import express from "express";
import mongoose from "mongoose";

const healthRoute=express.Router();

healthRoute.get("/",(req, res)=>{
    res.status(200).json({
        message:"Spendwise API is running!",
        success: true,
        database: mongoose.connection.readyState === 1 ? "connected":"Disconnected"
    });
});

export default healthRoute;