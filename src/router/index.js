const express = require("express");
const router = express.Router();
const { protect } = require('../middleware/auth')
const { police } = require('../middleware/police')

// Bank monitoring
router.use("/bank/monitoring", protect, police('bank'), require("./bank/bank.monitoring.routes"));
router.use("/bank/income", protect, police('bank'), require("./bank/bank.prixod.routes"));
router.use("/bank/expense", protect, police('bank'), require("./bank/bank.rasxod.routes"));

// Kassa monitoring
router.use("/kassa/monitoring", protect, police('kassa'), require("./kassa/kassa.monitoring.routes"));
router.use("/kassa/income", protect, police('kassa'), require("./kassa/kassa.prixod.routes"));
router.use("/kassa/expense", protect, police('kassa'), require("./kassa/kassa.rasxod.routes"));

// Auth routes
router.use("/auth", require("./auth/auth.routes"));
router.use("/auth/region", protect, police('region'), require("./auth/region.routes"));
router.use("/auth/role", protect, police('role'), require("./auth/role.routes"));
router.use("/auth/access", protect, police('access'), require('./auth/access.routes'));
router.use("/auth/user", protect, police('users'), require('./auth/user.routes'));
router.use("/auth/admin", protect, police('region_users'), require('./auth/admin.routes'));

// organization monitoring 
router.use('/organization/monitoring', protect, police('organization_monitoring'), require('./organization/organization.router'))

// spravochnik  routes
router.use("/spravochnik/podotchet-litso", protect, police('spravochnik'), require("./spravochnik/podochet.litso.routes"));
router.use("/spravochnik/podrazdelenie", protect, police('spravochnik'), require("./spravochnik/podrazdelenie.routes"));
router.use("/spravochnik/type-operatsii", protect, police('spravochnik'), require("./spravochnik/type_operatsii.routes"));
router.use("/spravochnik/organization", protect, police('spravochnik'), require("./spravochnik/organization.routes"));
router.use("/spravochnik/operatsii", protect, police('spravochnik'), require("./spravochnik/operatsii.routes"));
router.use("/spravochnik/main-schet", require("./spravochnik/main_schet.routes"));
router.use("/spravochnik/budjet-name", protect, police('budjet'), require("./spravochnik/budjet_name.routes"));
router.use("/spravochnik/sostav", protect, police('spravochnik'), require("./spravochnik/sostav.routes"));

// Smeta routes
router.use("/smeta/grafik", protect, police('smeta_grafik'), require("./smeta/smeta.grafik.routes"));
router.use("/smeta", protect, police('smeta'), require("./smeta/smeta.routes"));

// shartnoma routes
router.use("/shartnoma/grafik", protect, police('shartnoma'), require("./shartnoma/shartnoma.grafik.routes"));
router.use("/shartnoma", protect, police('shartnoma'), require("./shartnoma/shartnoma.routes"));

// akt routes
router.use("/akt", protect, police('jur3'), require("./akt/akt.routes"));

// avans routes 
router.use("/avans", protect, police('jur4'), require("./avans/avans.routes"));

// show service  routes
router.use("/services/show", protect, police('jur152'), require("./show.services/show.services.routes"));

// podotchet monitoring 
router.use('/podotchet/monitoring', protect, police('podotchet_monitoring'), require('./podotchet/podotchet.monitoring.router'))

// jur 7 routes 
router.use('/jur_7/pereotsenka', protect, require('./jur_7/pereotsenka.router'))
router.use('/jur_7/group', protect, require('./jur_7/group.jur7.router'))

module.exports = router;
