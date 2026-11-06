import express from "express";
import cors from "cors";
import healthRoute from "./routes/healthRoute.js";
import authRoutes from "./routes/user.route.js";
import expenseRoutes from "./routes/expense.route.js";
import receiptRoutes from "./routes/receipt.routes.js";

const app=express();

app.use(express.json()); //parse
app.use(cors()); //allow request from frontend

//API end point
app.get("/", (req, res)=>{
    res.send("Welcome to the Spendwise API");
});


//routes
app.use("/api/health", healthRoute);
app.use("/api/auth", authRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/receipts", receiptRoutes);
export default app;