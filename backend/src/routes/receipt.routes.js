import { scanReceipt } from "../controllers/receipt.controller.js";
import userMiddleware from "../middleware/user.middleware.js";
import upload from "../middleware/upload.middleware.js";
import express from "express";

const receiptRoutes = express.Router();

receiptRoutes.post(
    "/scan",
    userMiddleware,
    upload.single("receipt"),
    scanReceipt
);

export default receiptRoutes;