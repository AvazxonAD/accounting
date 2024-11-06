const { Router } = require("express");
const router = Router();

const { getOrganizationMonitoring, aktSverka, orderOrganization } = require("./ozganization.monitoring.controller");

router.get('/akt/sverka', aktSverka)
router.get("/", getOrganizationMonitoring);
router.get('/order', orderOrganization)

module.exports = router;
