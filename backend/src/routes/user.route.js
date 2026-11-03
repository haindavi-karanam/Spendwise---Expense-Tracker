import express from "express";
import { registerUser } from "../controllers/user.controller.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerUser);

export default authRoutes;