import mongoose from "mongoose";
import Expense from "../models/Expense.js";
import expenseRoutes from "../routes/expense.route.js";

export const createExpense = async (req, res) => {
    try {
        // Get data from req.body
        const { title, amount, type, category, date} = req.body;
        

        // Validate required fields
        if(!title||!amount||!type||!category||!date){
            res.status(400).json({
                message:"Please enter all the required fields"
            });
        }
        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a positive number"
            });
        }

        // Create expense and assign req.user
        const expense = await Expense.create({
            title,
            amount,
            type,
            category, 
            date: date || Date.now(),
            user: req.user
        });

        // Send success response
        res.status(201).json({
            success: true,
            message:"Transaction recorded successfully",
            expense
        });

    } catch (error) {
        console.error("Create expense error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
export const getExpenses = async (req, res) => {
    try {
        const { type, category, startDate, endDate } = req.query; 
        const filter = {
            user: req.user
        };
        //type and category
        if (type) {
            filter.type = type;
        }

        if (category) {
            filter.category = category;
        }
        //dates
        if (startDate || endDate) {
            filter.date = {};

        if (startDate) {
            filter.date.$gte = new Date(startDate);
        }

        if (endDate) {
            filter.date.$lte = new Date(endDate);
        }
        }

        const expense = await Expense.find(filter).sort({date:-1}); 


            res.status(200).json({
            success: true,
            message:"Expenses retrived successfully",
            count: expense.length,
            expense
        });

    } catch (error) {
        // Handle errors
        console.error("Get expenses error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
export const getExpenseById = async (req, res) => {
    try {
        // 1. Get expense ID from request parameters
        const expenseID = req.params.id;
        // 2. Find expense using ID and logged-in user's ID
        const expense = await Expense.findOne({
                _id: expenseID,
                user: req.user})
        // 3. If expense doesn't exist, return 404
            if(!expense){
                return res.status(404).json({
                    message:"Expenses not found",
                    success: false
                });
            }
        // 4. Return the expense
            return res.status(200).json({
                success: true,
                message: "Expenses retrived successfully",
                expense
            })
    } catch (error) {
        // Handle errors
        
        console.error("Get expenses by ID error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const updateExpense = async (req, res) => {
    try {
        const expenseID = req.params.id;

        const { title, amount, type, category, date } = req.body;

        // allowed fileds to update
        const updates = {};
        if (title !== undefined) updates.title = title;
        if (amount !== undefined) updates.amount = amount;
        if (type !== undefined) updates.type = type;
        if (category !== undefined) updates.category = category;
        if (date !== undefined) updates.date = date;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields provided for update"
            });
        }

        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: expenseID, user: req.user },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            expense: updatedExpense
        });

    } catch (error) {
        console.error("Update expense error:", error);

        if (error.name === "CastError" || error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Invalid expense ID or update data"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const expenseID = req.params.id;

        const deletedExpense = await Expense.findOneAndDelete({
            _id: expenseID,
            user: req.user
        });

        if (!deletedExpense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Expense deleted successfully",
            expense: deletedExpense
        });

    } catch (error) {
        console.error("Delete expense error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid expense ID"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
export const getExpenseSummary = async (req, res)=>{
    try{
        const summary = await Expense.aggregate([
             {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user)
                }
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ]);
        let totalIncome = 0;
        let totalExpense = 0;

        summary.forEach((item) => {
            if (item._id === "income") {
                totalIncome = item.total;
            }

            if (item._id === "expense") {
                totalExpense = item.total;
            }
        });

        const categoryBreakdown = await Expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user),
                    type: "expense"
                }
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    total: 1
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        return res.status(200).json({
            success: true,
            summary: {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense
            },
            categoryBreakdown
        });

    } catch (error) {
        console.error("Summary error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
    