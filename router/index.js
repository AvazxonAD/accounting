// ./router/index.js
const express = require('express');
const authRouter = require('./auth/auth.router');
const regionRouter = require('./auth/region.router');
const roleRouter = require('./auth/role.router');
const userRouter = require('./auth/user.router');
const spravochnik_podotchet_litsoRouter = require('./spravochnik/podochet.litso.router');
const spravochnik_podrazdelenieRouter = require('./spravochnik/podrazdelenie.router');
const spravochnik_type_operatsiiRouter = require('./spravochnik/type_operatsii.router');
const spravochnik_organizationRouter = require('./spravochnik/organization.router');
const spravochnik_operatsiiRouter = require('./spravochnik/operatsii.router');
const main_schetRouter = require('./spravochnik/main_schet.router');
const budjet_nameRouter = require('./spravochnik/budjet_name.router')
const spravochnik_sostavRouter = require('./spravochnik/sostav.router')
const smetaRouter = require('./smeta/smeta.router')
const shartnomaRouter = require('./shartnoma/shartnoma.router')
const bankRouter = require('./bank/bank.router')
const kassaRouter  = require('./kassa/kassa.router')

const router = express.Router();

router.use('/auth', authRouter);
router.use('/region', regionRouter);
router.use('/role', roleRouter);
router.use('/user', userRouter);
router.use('/spravochnik_podotchet_litso', spravochnik_podotchet_litsoRouter);
router.use('/spravochnik_podrazdelenie', spravochnik_podrazdelenieRouter);
router.use('/spravochnik_type_operatsii', spravochnik_type_operatsiiRouter);
router.use('/spravochnik_organization', spravochnik_organizationRouter);
router.use('/spravochnik_operatsii', spravochnik_operatsiiRouter);
router.use('/main_schet', main_schetRouter);
router.use('/budjet_name', budjet_nameRouter)
router.use('/spravochnik_sostav', spravochnik_sostavRouter)
router.use('/smeta', smetaRouter)
router.use('/shartnoma', shartnomaRouter)
router.use('/bank', bankRouter)
router.use('/kassa', kassaRouter)


module.exports = router;
