// ./router/index.js
const express = require('express');
const authRouter = require('./auth/auth.router');
const expenseRouter = require('./2-jurnal/expence.router');
const revenueRouter = require('./2-jurnal/revenue.router');
const bankResultRouter = require('./2-jurnal/bank.result.router');
const restrRouter = require('./2-jurnal/restr.router');
const regionRouter = require('./auth/region.router')
const roleRouter = require('../router/auth/role.router')
const userRouter = require('./auth/user.router')
const spravochnik_podotchet_litsoRouter = require('../router/spravochnik/podochet.litso.router')
const spravochnik_podrazdelenieRouter = require('../router/spravochnik/podrazdelenie.router')
const spravochnik_type_operatsiiRouter = require('../router/spravochnik/type_operatsii.router')
const spravochnik_organizationRouter = require('../router/spravochnik/organization.router')
const spravochnik_operatsiiRouter = require('../router/spravochnik/operatsii.router')

const router = express.Router();

router.use('/auth', authRouter);
router.use('/expense', expenseRouter);
router.use('/revenue', revenueRouter);
router.use('/bank', bankResultRouter);
router.use('/bank/restr', restrRouter);
router.use('/region', regionRouter)
router.use('/role', roleRouter)
router.use('/user', userRouter)
router.use('/spravochnik_podotchet_litso', spravochnik_podotchet_litsoRouter)
router.use('/spravochnik_podrazdelenie', spravochnik_podrazdelenieRouter)
router.use('/spravochnik_type_operatsii', spravochnik_type_operatsiiRouter)
router.use('/spravochnik_organization', spravochnik_organizationRouter)
router.use('/spravochnik_operatsii', spravochnik_operatsiiRouter)


module.exports = router;
