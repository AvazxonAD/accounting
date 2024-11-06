const { Router } = require("express");
const router = Router();

const { getOrganizationMonitoring, aktSverka } = require("./ozganization.monitoring.controller");

router.get('/akt/sverka', aktSverka)
router.get("/", getOrganizationMonitoring);

module.exports = router;
