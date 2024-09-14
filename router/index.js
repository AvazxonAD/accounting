// ./router/index.js
const express = require('express');
const authRouter = require('./auth/auth.router');
const positionRouter = require('./auth/position.router');
const requisiteRouter = require('./auth/requisite.router');
const goalRouter = require('./storage/goal.router');
const partnerRouter = require('./storage/partner.router');
const expenseRouter = require('./2-jurnal/expence.router');
const revenueRouter = require('./2-jurnal/revenue.router');
const bankResultRouter = require('./2-jurnal/bank.result.router');
const restrRouter = require('./2-jurnal/restr.router');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/auth', positionRouter);
router.use('/requisite', requisiteRouter);
router.use('/spravichnik', goalRouter);
router.use('/spravichnik', partnerRouter);
router.use('/expense', expenseRouter);
router.use('/revenue', revenueRouter);
router.use('/bank', bankResultRouter);
router.use('/bank/restr', restrRouter);

module.exports = router;
