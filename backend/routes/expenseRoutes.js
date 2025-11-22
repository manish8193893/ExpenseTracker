const express = require('express');
const { addExpense, getAllExpense, deleteExpense, downloadExpenseExcel } = require('../controllers/expenseController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to add income
router.post('/add', protect, addExpense);
// Route to get all income records
router.get('/get', protect, getAllExpense);
// Route to delete an income record
router.delete('/:id', protect, deleteExpense);
// Route to download income records as an Excel file
router.get('/downloadexcel', protect, downloadExpenseExcel);

module.exports = router;