import { createExpense, 
        getExpenses, 
        getExpenseById,
        updateExpense,
        deleteExpense

} from "../controllers/expense.controller.js";
import userMiddleware from "../middleware/user.middleware.js";
import express from "express";

const expenseRoutes = express.Router();

expenseRoutes.post("/", userMiddleware, createExpense);
expenseRoutes.get("/", userMiddleware, getExpenses);
expenseRoutes.get("/:id", userMiddleware, getExpenseById);

expenseRoutes.put("/:id", userMiddleware, updateExpense);
expenseRoutes.patch("/:id", userMiddleware, updateExpense);
expenseRoutes.delete("/:id", userMiddleware, deleteExpense);


export default expenseRoutes;
