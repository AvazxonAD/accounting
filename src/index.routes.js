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
routes.use("/auth", require("./auth/auth.routes"));
routes.use("/auth/region", protect, police('region'), require("./auth/region.routes"));
routes.use("/auth/role", protect, police('role'), require("./auth/role.routes"));
routes.use("/auth/access", protect, police('access'), require('./auth/access.routes'));
routes.use("/auth/user", protect, police('users'), require('./auth/user.routes'));
routes.use("/auth/admin", protect, police('region_users'), require('./auth/admin.routes'));

// organization monitoring 
routes.use('/organization/monitoring', protect, police('organization_monitoring'), require('./organization.monitoring/organization.monitoring.routes'))

// spravochnik  routes
routes.use("/spravochnik/podotchet-litso", protect, police('spravochnik'), require("./spravochnik/podotchet/podochet.litso.routes"));
routes.use("/spravochnik/podrazdelenie", protect, police('spravochnik'), require("./spravochnik/podrazdelenie/podrazdelenie.routes"));
routes.use("/spravochnik/type-operatsii", protect, police('spravochnik'), require("./spravochnik/type.operatsii/type_operatsii.routes"));
routes.use("/spravochnik/organization", protect, police('spravochnik'), require("./spravochnik/organization/organization.routes"));
routes.use("/spravochnik/operatsii", protect, police('spravochnik'), require("./spravochnik/operatsii/operatsii.routes"));
routes.use("/spravochnik/main-schet", require("./spravochnik/main.schet/main_schet.routes"));
routes.use("/spravochnik/budjet-name", protect, police('budjet'), require("./spravochnik/budjet/budjet_name.routes"));
routes.use("/spravochnik/sostav", protect, police('spravochnik'), require("./spravochnik/sostav/sostav.routes"));
routes.use("/spravochnik/podpis", protect, police('spravochnik'), require("./spravochnik/podpis/podpis.routes"));
routes.use("/spravochnik/schet/operatsii", protect, police('spravochnik'), require("./spravochnik/schet.operatsii/schet.operatsii.routes"));

// Smeta routes
routes.use("/smeta/grafik", protect, police('smeta_grafik'), require("./smeta/smeta.grafik.routes"));
routes.use("/smeta", protect, police('smeta'), require("./smeta/smeta.routes"));

// shartnoma routes
routes.use("/shartnoma/grafik", protect, police('shartnoma'), require("./shartnoma/shartnoma.grafik.routes"));
routes.use("/shartnoma", protect, police('shartnoma'), require("./shartnoma/shartnoma.routes"));

// akt routes
routes.use("/akt", protect, police('jur3'), require("./akt/akt.routes"));

// avans routes 
routes.use("/avans", protect, police('jur4'), require("./avans/avans.routes"));

// show service  routes
routes.use("/services/show", protect, police('jur152'), require("./show.service/show.services.routes"));

// podotchet monitoring 
routes.use('/podotchet/monitoring', protect, police('podotchet_monitoring'), require('./podotchet.monitoring/podotchet.monitoring.routes'))

// jur 7 routes 
routes.use('/jur_7/pereotsenka', protect, require('./jur7/pereotsenka.routes'))
routes.use('/jur_7/group', protect, require('./jur7/group.jur7.routes'))
routes.use('/jur_7/podrazdelenie', protect, require('./jur7/podrazdelenie.routes'))
routes.use('/jur_7/responsible', protect, require('./jur7/responsible.routes'))
routes.use('/jur_7/naimenovanie', protect, require('./jur7/naimenovanie.routes'))
routes.use('/jur_7/doc_prixod', protect, require('./jur7/operatsii/doc_prixxod_jur7.routes'))
routes.use('/jur_7/doc_rasxod', protect, require('./jur7/operatsii/doc_rasxod_jur7.routes'))
routes.use('/jur_7/internal', protect, require('./jur7/operatsii/internal.transfer.routes'))

module.exports = routes;
