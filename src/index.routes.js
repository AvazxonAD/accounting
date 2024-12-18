const express = require("express");
const routes = express.Router();
const { protect } = require('./middleware/auth')

// Bank monitoring
routes.use("/bank/monitoring", protect, require("./bank/bank.monitoring.routes"));
routes.use("/bank/income", protect, require("./bank/bank.prixod.routes"));
routes.use("/bank/expense", protect, require("./bank/bank.rasxod.routes"));

// Kassa monitoring
routes.use("/kassa/monitoring", protect, require("./kassa/kassa.monitoring.routes"));
routes.use("/kassa/income", protect, require("./kassa/kassa.prixod.routes"));
routes.use("/kassa/expense", protect, require("./kassa/kassa.rasxod.routes"));

// Auth routes
routes.use("/auth", require("./auth/auth/index"));
routes.use("/auth/region", protect, require("./auth/region/index"));
routes.use("/auth/role", protect, require("./auth/role/index"));
routes.use("/auth/access", protect, require('./auth/access/index'));
routes.use("/auth/user", protect, require('./auth/user/index'));
routes.use("/auth/admin", protect, require('./auth/admin/index'));

// organization monitoring 
routes.use('/organization/monitoring', protect, require('./organization.monitoring/index'))

// spravochnik  routes
routes.use("/spravochnik/podotchet-litso", protect, require("./spravochnik/podotchet/podochet.litso.routes"));
routes.use("/spravochnik/podrazdelenie", protect, require("./spravochnik/podrazdelenie/podrazdelenie.routes"));
routes.use("/spravochnik/type-operatsii", protect, require("./spravochnik/type.operatsii/type_operatsii.routes"));
routes.use("/spravochnik/organization", protect, require("./spravochnik/organization/index"));
routes.use("/spravochnik/operatsii", protect, require("./spravochnik/operatsii/operatsii.routes"));
routes.use("/spravochnik/main-schet", require("./spravochnik/main.schet/main_schet.routes"));
routes.use("/spravochnik/budjet-name", protect, require("./spravochnik/budjet/budjet_name.routes"));
routes.use("/spravochnik/sostav", protect, require("./spravochnik/sostav/sostav.routes"));
routes.use("/spravochnik/podpis", protect, require("./spravochnik/podpis/podpis.routes"));
routes.use("/spravochnik/bank", protect, require("./spravochnik/bank/index"));

// Smeta routes
routes.use("/smeta/grafik", protect, require("./smeta/grafik/index"));
routes.use("/smeta", protect, require("./smeta/smeta/index"));

// shartnoma routes
routes.use("/shartnoma/grafik", protect, require("./shartnoma/shartnoma.grafik.routes"));
routes.use("/shartnoma", protect, require("./shartnoma/shartnoma.routes"));

// akt routes
routes.use("/akt", protect, require("./akt/index"));

// avans routes 
routes.use("/avans", protect, require("./avans/avans.routes"));

// show service  routes
routes.use("/services/show", protect, require("./show.service/index"));

// podotchet monitoring 
routes.use('/podotchet/monitoring', protect, require('./podotchet.monitoring/index'))

// jur 7 routes
routes.use('/jur_7/group', protect, require('./jur7/spravochnik/group/index'))
routes.use('/jur_7/pereotsenka', protect, require('./jur7/spravochnik/pereotsenka/index'))
routes.use('/jur_7/podrazdelenie', protect, require('./jur7/spravochnik/podrazdelenie/index'))
routes.use('/jur_7/responsible', protect, require('./jur7/spravochnik/responsible/index'))
routes.use('/jur_7/naimenovanie', protect, require('./jur7/spravochnik/naimenovanie/index'))
routes.use('/jur_7/doc_prixod', protect,  require('./jur7/prixod/index'))
routes.use('/jur_7/doc_rasxod', protect, require('./jur7/rasxod/index'))
routes.use('/jur_7/internal', protect, require('./jur7/internal/index'))
routes.use('/jur_7/unit', protect, require('./jur7/spravochnik/unit'))
routes.use('/jur_7/iznos', protect, require('./jur7/iznos/index'))
routes.use('/jur_7/monitoring', protect, require('./jur7/monitoring/index'))

// logs 
routes.use('/log', protect, require('./log/index'))

module.exports = routes;
