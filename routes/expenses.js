const express = require('express');
const router = express.Router();
const authentication = require('../middleware/auth');

const expenseController = require('../controllers/expense');


router.post('/addExpense',authentication.authenticate, expenseController.addExpense);
router.get('/getExpenses', authentication.authenticate, expenseController.getExpenses);
router.delete('/deleteExpense/:id', expenseController.deleteExpense);

router.get('/download', authentication.authenticate, expenseController.downloadExpense);



module.exports = router;
