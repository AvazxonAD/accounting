const express = require("express");
const routes = express.Router();
const { protect } = require('./middleware/auth');

// Bank monitoring
routes
    .use("/bank/monitoring", protect, require("./bank/bank.monitoring.routes"))
    .use("/bank/income", protect, require("./bank/bank.prixod.routes"))
    .use("/bank/expense", protect, require("./bank/bank.rasxod.routes"))
    // Kassa monitoring
    .use("/kassa/monitoring", protect, require("./kassa/kassa.monitoring.routes"))
    .use("/kassa/income", protect, require("./kassa/kassa.prixod.routes"))
    .use("/kassa/expense", protect, require("./kassa/kassa.rasxod.routes"))
    // Auth routes
    .use("/auth", require("./auth/auth/index"))
    .use("/auth/region", protect, require("./auth/region/index"))
    .use("/auth/role", protect, require("./auth/role/index"))
    .use("/auth/access", protect, require('./auth/access/index'))
    .use("/auth/user", protect, require('./auth/user/index'))
    .use("/auth/admin", protect, require('./auth/admin/index'))
    .use("/auth/control", protect, require('./auth/control/index'))
    // Organization monitoring
    .use('/organization/monitoring', protect, require('./organ.monitoring/index'))
    // Spravochnik routes
    .use("/spravochnik/podotchet-litso", protect, require("./spravochnik/podotchet/podochet.litso.routes"))
    .use('/spravochnik/main/book/schet', protect, require('./spravochnik/main.book.schet/index'))
    .use("/spravochnik/podrazdelenie", protect, require("./spravochnik/podrazdelenie/podrazdelenie.routes"))
    .use("/spravochnik/type-operatsii", protect, require("./spravochnik/type.operatsii/type_operatsii.routes"))
    .use("/spravochnik/organization", protect, require("./spravochnik/organization/index"))
    .use("/spravochnik/operatsii", protect, require("./spravochnik/operatsii/operatsii.routes"))
    .use("/spravochnik/main-schet", require("./spravochnik/main.schet/main_schet.routes"))
    .use("/spravochnik/budjet-name", protect, require("./spravochnik/budjet/budjet_name.routes"))
    .use("/spravochnik/sostav", protect, require("./spravochnik/sostav/sostav.routes"))
    .use("/spravochnik/podpis", protect, require("./spravochnik/podpis/podpis.routes"))
    .use("/spravochnik/bank", protect, require("./spravochnik/bank/index"))
    // Smeta routes
    .use("/smeta/grafik", protect, require("./smeta/grafik/index"))
    .use("/smeta", protect, require("./smeta/smeta/index"))
    // Shartnoma routes
    .use("/shartnoma/grafik", protect, require("./shartnoma/shartnoma.grafik.routes"))
    .use("/shartnoma", protect, require("./shartnoma/shartnoma.routes"))
    // Akt routes
    .use("/akt", protect, require("./akt/index"))
    // Avans routes
    .use("/avans", protect, require("./avans/avans.routes"))
    // Show service routes
    .use("/services/show", protect, require("./show.service/index"))
    // Podotchet monitoring
    .use('/podotchet/monitoring', protect, require('./pod.monitoring/index'))
    // Jur 7 routes
    .use('/jur_7/group', protect, require('./jur7/spravochnik/group/index'))
    .use('/jur_7/pereotsenka', protect, require('./jur7/spravochnik/pereotsenka/index'))
    .use('/jur_7/podrazdelenie', protect, require('./jur7/spravochnik/podrazdelenie/index'))
    .use('/jur_7/responsible', protect, require('./jur7/spravochnik/responsible/index'))
    .use('/jur_7/naimenovanie', protect, require('./jur7/spravochnik/naimenovanie/index'))
    .use('/jur_7/doc_prixod', protect, require('./jur7/prixod/index'))
    .use('/jur_7/doc_rasxod', protect, require('./jur7/rasxod/index'))
    .use('/jur_7/internal', protect, require('./jur7/internal/index'))
    .use('/jur_7/unit', protect, require('./jur7/spravochnik/unit'))
    .use('/jur_7/iznos', protect, require('./jur7/iznos/index'))
    .use('/jur_7/monitoring', protect, require('./jur7/monitoring/index'))
    // Main book routes
    .use('/main/book/doc', protect, require('./main.book/doc/index'))
    .use('/main/book/report', protect, require('./main.book/report/index'))
    // Real cost routes
    .use('/real/cost/doc', protect, require('./real.cost/doc/index'))
    .use('/real/cost/report', protect, require('./real.cost/report/index'))
    // Ox routes 
    .use('/ox/doc', protect, require('./ox/doc/index'))
    .use('/ox/report', protect, require('./ox/report/index'))
    // Logs
    .use('/log', protect, require('./log/index'))
    // Features
    .use('/features', protect, require('./features/index'))
    // Admin
    .use('/admin/main/book', protect, require('./admin/main.book/index'))
    .use('/admin/ox', protect, require('./admin/ox/index'))
    .use('/admin/dashboard', protect, require('./admin/dashboard/index'))
    .use('/admin/real/cost', protect, require('./admin/real.cost/index'));

module.exports = routes;
