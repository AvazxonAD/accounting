const express = require("express");
const routes = express.Router();
const { protect } = require('./middleware/auth')
const { police } = require('./middleware/police')

// Bank monitoring
routes.use("/bank/monitoring", protect, police('bank'), require("./bank/bank.monitoring.routes"));
routes.use("/bank/income", protect, police('bank'), require("./bank/bank.prixod.routes"));
routes.use("/bank/expense", protect, police('bank'), require("./bank/bank.rasxod.routes"));

// Kassa monitoring
routes.use("/kassa/monitoring", protect, police('kassa'), require("./kassa/kassa.monitoring.routes"));
routes.use("/kassa/income", protect, police('kassa'), require("./kassa/kassa.prixod.routes"));
routes.use("/kassa/expense", protect, police('kassa'), require("./kassa/kassa.rasxod.routes"));

// Auth routes
routes.use("/auth", require("./auth/auth/index"));
routes.use("/auth/region", protect, police('region'), require("./auth/region/index"));
routes.use("/auth/role", protect, police('role'), require("./auth/role/index"));
routes.use("/auth/access", protect, police('access'), require('./auth/access/index'));
routes.use("/auth/user", protect, police('users'), require('./auth/user/index'));
routes.use("/auth/admin", protect, police('region_users'), require('./auth/admin/index'));

// organization monitoring 
routes.use('/organization/monitoring', protect, police('organization_monitoring'), require('./organization.monitoring/index'))

// spravochnik  routes
routes.use("/spravochnik/podotchet-litso", protect, police('spravochnik'), require("./spravochnik/podotchet/podochet.litso.routes"));
routes.use("/spravochnik/podrazdelenie", protect, police('spravochnik'), require("./spravochnik/podrazdelenie/podrazdelenie.routes"));
routes.use("/spravochnik/type-operatsii", protect, police('spravochnik'), require("./spravochnik/type.operatsii/type_operatsii.routes"));
routes.use("/spravochnik/organization", protect, police('spravochnik'), require("./spravochnik/organization/index"));
routes.use("/spravochnik/operatsii", protect, police('spravochnik'), require("./spravochnik/operatsii/operatsii.routes"));
routes.use("/spravochnik/main-schet", require("./spravochnik/main.schet/main_schet.routes"));
routes.use("/spravochnik/budjet-name", protect, police('budjet'), require("./spravochnik/budjet/budjet_name.routes"));
routes.use("/spravochnik/sostav", protect, police('spravochnik'), require("./spravochnik/sostav/sostav.routes"));
routes.use("/spravochnik/podpis", protect, police('spravochnik'), require("./spravochnik/podpis/podpis.routes"));
routes.use("/spravochnik/bank", protect, police('spravochnik'), require("./spravochnik/bank/index"));

// Smeta routes
routes.use("/smeta/grafik", protect, police('smeta_grafik'), require("./smeta/grafik/index"));
routes.use("/smeta", protect, police('smeta'), require("./smeta/smeta/index"));

// shartnoma routes
routes.use("/shartnoma/grafik", protect, police('shartnoma'), require("./shartnoma/shartnoma.grafik.routes"));
routes.use("/shartnoma", protect, police('shartnoma'), require("./shartnoma/shartnoma.routes"));

// akt routes
routes.use("/akt", protect, police('jur3'), require("./akt/index"));

// avans routes 
routes.use("/avans", protect, police('jur4'), require("./avans/avans.routes"));

// show service  routes
routes.use("/services/show", protect, police('jur152'), require("./show.service/index"));

// podotchet monitoring 
routes.use('/podotchet/monitoring', protect, police('podotchet_monitoring'), require('./podotchet.monitoring/index'))

// jur 7 routes 
routes.use('/jur_7/group', protect, require('./jur7/spravochnik/group/index'))
routes.use('/jur_7/pereotsenka', protect, require('./jur7/spravochnik/pereotsenka/index'))
routes.use('/jur_7/podrazdelenie', protect, require('./jur7/spravochnik/podrazdelenie/index'))
routes.use('/jur_7/responsible', protect, require('./jur7/spravochnik/responsible/index'))
routes.use('/jur_7/naimenovanie', protect, require('./jur7/spravochnik/naimenovanie/index'))
routes.use('/jur_7/doc_prixod', protect, require('./jur7/prixod/index'))
routes.use('/jur_7/doc_rasxod', protect, require('./jur7/rasxod/index'))
routes.use('/jur_7/internal', protect, require('./jur7/internal/index'))
routes.use('/jur_7/unit', protect, require('./jur7/spravochnik/unit'))


module.exports = routes;
