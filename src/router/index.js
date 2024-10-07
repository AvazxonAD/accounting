const express = require("express");
const router = express.Router();

// Bank monitoring
router.use("/bank/monitoring", require("./bank/bank.monitoring.routes"));
router.use("/bank/income", require("./bank/bank.prixod.routes"));
router.use("/bank/expense", require("./bank/bank.rasxod.routes"));

// Kassa monitoring
router.use("/kassa/monitoring", require("./kassa/kassa.monitoring.routes"));
router.use("/kassa/income", require("./kassa/kassa.prixod.routes"));
router.use("/kassa/expense", require("./kassa/kassa.rasxod.routes"));

// Auth routes
router.use("/auth", require("./auth/auth.routes"));
router.use("/auth/region", require("./auth/region.routes"));
router.use("/auth/role", require("./auth/role.routes"));
router.use("/auth/access", require('./auth/access.routes'));
router.use("/auth/user", require('./auth/user.routes'));
router.use("/auth/admin", require('./auth/admin.routes'));

// spravochnik  routes
router.use("/spravochnik/podotchet-litso", require("./spravochnik/podochet.litso.routes"));
router.use("/spravochnik/podrazdelenie", require("./spravochnik/podrazdelenie.routes"));
router.use("/spravochnik/type-operatsii", require("./spravochnik/type_operatsii.routes"));
router.use("/spravochnik/organization", require("./spravochnik/organization.routes"));
router.use("/spravochnik/operatsii", require("./spravochnik/operatsii.routes"));
router.use("/spravochnik/main-schet", require("./spravochnik/main_schet.routes"));
router.use("/spravochnik/budjet-name", require("./spravochnik/budjet_name.routes"));
router.use("/spravochnik/sostav", require("./spravochnik/sostav.routes"));

// Smeta routes
router.use("/smeta/grafik", require("./smeta/smeta.grafik.routes"));
router.use("/smeta", require("./smeta/smeta.routes"));

// shartnoma routes
router.use("/shartnoma/grafik", require("./shartnoma/shartnoma.grafik.routes"));
router.use("/shartnoma", require("./shartnoma/shartnoma.routes"));

// akt routes
router.use("/akt", require("./akt/akt.routes"));

// avans routes 
router.use("/avans", require("./avans/avans.routes"));

// other routes
router.use("/services/show", require("./show.services/show.services.routes"));

module.exports = router;
