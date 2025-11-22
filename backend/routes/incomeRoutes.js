const express = require('express');
const { addIncome, getAllIncome, deleteIncome, downloadIncomeExcel } = require('../controllers/incomeController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to add income
router.post('/add', protect, addIncome);
// Route to get all income records
router.get('/get', protect, getAllIncome);
// Route to delete an income record
router.delete('/:id', protect, deleteIncome);
// Route to download income records as an Excel file
router.get('/downloadexcel', protect, downloadIncomeExcel);

module.exports = router;