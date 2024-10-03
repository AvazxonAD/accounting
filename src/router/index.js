const express = require("express");
const router = express.Router();

const authRouter = require("./auth/auth.router");
const regionRouter = require("./auth/region.router");
const roleRouter = require("./auth/role.router");
const spravochnik_podotchet_litsoRouter = require("./spravochnik/podochet.litso.router");
const spravochnik_podrazdelenieRouter = require("./spravochnik/podrazdelenie.router");
const spravochnik_type_operatsiiRouter = require("./spravochnik/type_operatsii.router");
const spravochnik_organizationRouter = require("./spravochnik/organization.router");
const spravochnik_operatsiiRouter = require("./spravochnik/operatsii.router");
const main_schetRouter = require("./spravochnik/main_schet.router");
const budjet_nameRouter = require("./spravochnik/budjet_name.router");
const spravochnik_sostavRouter = require("./spravochnik/sostav.router");
const smetaRouter = require("./smeta/smeta.router");
const shartnomaRouter = require("./shartnoma/shartnoma.router");
const bankPrixodRouter = require("./bank/bank.prixod.router");
const bankRasxodRouter = require("./bank/bank.rasxod.router");
const kassaPrixodRouter = require("./kassa/kassa.prixod.router");
const smetaGarfik = require("./smeta/smeta.grafik.router");
const bajarilgan_ishlar_jur3Router = require("./bajarilgan_ishlar/jur_3.router");
const avans_otchetlar_jur4Router = require("./avans_otchetlar/jur_4.router");
const bankMonitoring = require("./bank/bank.monitoring");
const kassaRasxodRouter = require("./kassa/kassa.rasxod.router");
const kassaMonitoringRouter = require("./kassa/kassa.monitoring.router");
const shartnomaGrafikRouter = require("./shartnoma/shartnoma.grafik.router");
const accessRouter = require('./auth/access.router')
const regionUsersRouter = require('./auth/region.users.router')
const superAdminUsersRouter = require('./auth/super.admin.users')


router.use("/bank/monitoring", bankMonitoring);
router.use("/kassa/monitoring", kassaMonitoringRouter);
router.use("/auth", authRouter);
router.use("/region", regionRouter);
router.use("/role", roleRouter);
router.use("/spravochnik_podotchet_litso", spravochnik_podotchet_litsoRouter);
router.use("/spravochnik_podrazdelenie", spravochnik_podrazdelenieRouter);
router.use("/spravochnik_type_operatsii", spravochnik_type_operatsiiRouter);
router.use("/spravochnik_organization", spravochnik_organizationRouter);
router.use("/spravochnik_operatsii", spravochnik_operatsiiRouter);
router.use("/main_schet", main_schetRouter);
router.use("/budjet_name", budjet_nameRouter);
router.use("/spravochnik_sostav", spravochnik_sostavRouter);
router.use("/smeta", smetaRouter);
router.use("/shartnoma", shartnomaRouter);
router.use("/shartnoma/grafik", shartnomaGrafikRouter);
router.use("/bank/prixod", bankPrixodRouter);
router.use("/bank/rasxod", bankRasxodRouter);
router.use("/kassa/prixod", kassaPrixodRouter);
router.use("/smeta/grafik", smetaGarfik);
router.use("/bajarilgan_ishlar", bajarilgan_ishlar_jur3Router);
router.use("/avans_otchetlar", avans_otchetlar_jur4Router);
router.use("/kassa/rasxod", kassaRasxodRouter);
router.use('/access', accessRouter)
router.use('/region_admin_users', regionUsersRouter)
router.use('/super_admin_users', superAdminUsersRouter)

module.exports = router;
