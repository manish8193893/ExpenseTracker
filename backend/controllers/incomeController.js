const xlsx = require('xlsx');
const Income = require('../models/Income');

// Add income source
exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body;

        // Validate input
        if (!amount || !source || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create new income record
        const newIncome = new Income({
            userId,
            icon,
            amount,
            source,
            date: new Date(date)
        });

        // Save income record to the database
        await newIncome.save();

        res.status(200).json(newIncome);
    } catch (error) {
        res.status(500).json({ message: "Server error while adding income" });
    }
}

// Get All Income Sources
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        // Fetch all income records for the user
        const incomes = await Income.find({ userId }).sort({ date: -1 });

        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching income records" });
    }
}

// Delete Income Source
exports.deleteIncome = async (req, res) => {
    try {
        // Find and delete the income record
        await Income.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Income record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error while deleting income record" });
    }
}

// download income records as an Excel file
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });

        if (incomes.length === 0) {
            return res.status(404).json({ message: "No income records found" });
        }

        // Convert income records to Excel format
        const excelData = incomes.map(income => ({
            Source: income.source,
            Amount: income.amount,
            Date: income.date,
        }));

        // Create a buffer for the Excel file
        const worksheet = xlsx.utils.json_to_sheet(excelData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Incomes');

        // Write the workbook to the response
        xlsx.writeFile(workbook, 'income_details.xlsx');
        res.download('income_details.xlsx');

    } catch (error) {
        res.status(500).json({ message: "Server error while downloading income records" });
    }
}