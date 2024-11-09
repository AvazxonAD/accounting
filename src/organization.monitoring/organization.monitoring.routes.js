const { Router } = require("express");
const router = Router();

const { getOrganizationMonitoring, aktSverka, orderOrganization, getOrganizationMonitoringAll } = require("./ozganization.monitoring.controller");

router.get('/akt/sverka', aktSverka)
router.get("/", getOrganizationMonitoring);
router.get('/order', orderOrganization)
router.get('/all', getOrganizationMonitoringAll)


module.exports = router;
