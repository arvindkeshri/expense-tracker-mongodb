const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    amount: Number,
    description: String,
    field: String
    }, 
    { timestamps: false} //disables createdat and updatedat
)


const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense;
