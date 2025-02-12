const express = require("express");
const routes = express.Router();
const { protect } = require('./middleware/auth');

// Bank monitoring
routes
    .use("/bank/monitoring", protect, require("@bank_monitoring/index"))
    .use("/bank/income", protect, require("@bank_prixod/index"))
    .use("/bank/expense", protect, require("@bank_rasxod/index"))
    // Kassa monitoring
    .use("/kassa/monitoring", protect, require("@kassa_monitoring/index"))
    .use("/kassa/income", protect, require("@kassa_prixod/index"))
    .use("/kassa/expense", protect, require('@kassa_rasxod/index'))
    // Auth routes
    .use("/auth", require("./auth/auth/index"))
    .use("/auth/region", protect, require("@region/index"))
    .use("/auth/role", protect, require("./auth/role/index"))
    .use("/auth/access", protect, require('./auth/access/index'))
    .use("/auth/user", protect, require('./auth/user/index'))
    .use("/auth/admin", protect, require('./auth/admin/index'))
    // Organization monitoring
    .use('/organization/monitoring', protect, require('@organ_monitoring/index'))
    // Spravochnik routes
    .use("/spravochnik/podotchet-litso", protect, require("@podotchet/podochet.litso.routes"))
    .use('/spravochnik/main/book/schet', protect, require('@main_book_schet/index'))
    .use("/spravochnik/podrazdelenie", protect, require("@podraz/podrazdelenie.routes"))
    .use("/spravochnik/type-operatsii", protect, require("@type_operatsii/type_operatsii.routes"))
    .use("/spravochnik/organization/gazna", protect, require("@gazna/index"))
    .use("/spravochnik/organization/account_number", protect, require("@account_number/index"))
    .use("/spravochnik/organization", protect, require("@organization/index"))
    .use("/spravochnik/operatsii", protect, require("./admin/spravochnik/operatsii/index"))
    .use("/spravochnik/main-schet", require("@main_schet/main_schet.routes"))
    .use("/spravochnik/budjet-name", protect, require("./admin/spravochnik/budjet/budjet_name.routes"))
    .use("/spravochnik/sostav", protect, require("@sostav/sostav.routes"))
    .use("/spravochnik/podpis", protect, require("@podpis/podpis.routes"))
    .use("/spravochnik/bank", protect, require("@bank/index"))
    // Smeta routes
    .use("/smeta/grafik", protect, require("@smeta_grafik/index"))
    .use("/smeta", protect, require("@smeta/index"))
    // Shartnoma routes
    .use("/shartnoma/grafik", protect, require("@contract_grafik/index"))
    .use("/shartnoma", protect, require("@contract/shartnoma.routes"))
    // Akt routes
    .use("/akt", protect, require("@akt/index"))
    // Avans routes
    .use("/avans", protect, require("@avans/index"))
    // Show service routes
    .use("/services/show", protect, require("@show_service/index"))
    // Podotchet monitoring
    .use('/podotchet/monitoring', protect, require('@pod_monitoring/index'))
    // Jur 7 routes
    .use('/jur_7/group', protect, require('@group/index'))
    .use('/jur_7/pereotsenka', protect, require('@pereotsenka/index'))
    .use('/jur_7/podrazdelenie', protect, require('@jur7_podraz/index'))
    .use('/jur_7/responsible', protect, require('@responsible/index'))
    .use('/jur_7/naimenovanie', protect, require('@product/index'))
    .use('/jur_7/doc_prixod', protect, require('@jur7_prixod/index'))
    .use('/jur_7/doc_rasxod', protect, require('@jur7_rasxod/index'))
    .use('/jur_7/internal', protect, require('@jur7_internal/index'))
    .use('/jur_7/unit', protect, require('@unit/index'))
    .use('/jur_7/iznos', protect, require('@iznos/index'))
    .use('/jur_7/monitoring', protect, require('@jur7_monitoring/index'))
    // Main book routes
    .use('/main/book/doc', protect, require('@main_book_doc/index'))
    .use('/main/book/report', protect, require('@main_book_report/index'))
    // Real cost routes
    .use('/real/cost/doc', protect, require('@real_cost_doc/index'))
    .use('/real/cost/report', protect, require('@real_cost_report/index'))
    // Ox routes 
    .use('/ox/doc', protect, require('@ox_doc/index'))
    .use('/ox/report', protect, require('@ox_report/index'))
    // Logs
    .use('/log', protect, require('@log/index'))
    // Features
    .use('/features', protect, require('@features/index'))
    // Dashboard
    .use('/dashboard', protect, require('@region_dashboard/index'))

    // Admin
    .use('/admin/main/book', protect, require('./admin/main.book/index'))
    .use('/admin/ox', protect, require('./admin/ox/index'))
    .use('/admin/dashboard', protect, require('./admin/dashboard/index'))
    .use("/admin/control", protect, require('./admin/control/index'))
    .use('/admin/real/cost', protect, require('./admin/real.cost/index'));

module.exports = routes;
