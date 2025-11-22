const xlsx = require('xlsx');
const Expense = require('../models/Expense');

// Add income source
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;

        // Validate input
        if (!amount || !category || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create new expense record
        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        // Save expense record to the database
        await newExpense.save();

        res.status(200).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Server error while adding expense" });
    }
}

// Get All Expense Sources
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        // Fetch all income records for the user
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching expense records" });
    }
}

// Delete Expense Source
exports.deleteExpense = async (req, res) => {
    try {
        // Find and delete the income record
        await Expense.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Income record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error while deleting expense record" });
    }
}

// download income records as an Excel file
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        if (expense.length === 0) {
            return res.status(404).json({ message: "No expense records found" });
        }

        // Convert income records to Excel format
        const excelData = expense.map(expense => ({
            Category: expense.category,
            Amount: expense.amount,
            Date: expense.date,
        }));

        // Create a buffer for the Excel file
        const worksheet = xlsx.utils.json_to_sheet(excelData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Expense');

        // Write the workbook to the response
        xlsx.writeFile(workbook, 'expense_details.xlsx');
        res.download('expense_details.xlsx');

    } catch (error) {
        res.status(500).json({ message: "Server error while downloading expense records" });
    }
}