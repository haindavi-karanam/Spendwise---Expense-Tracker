import mongoose from "mongoose";


const expenseSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    amount:{
        type: Number,
        required: true,
        min:0
    },
    type:{
        type: String,
        required: true,
        enum: ["income", "expense"]

    },
    category:{
        type: String,
        required: true,
        trim: true
    },
    date:{
        type: Date,
        required: true,
        default: Date.now

    },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
    }
},
{
    timestamps: true
   });

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
