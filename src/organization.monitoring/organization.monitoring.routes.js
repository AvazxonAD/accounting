const { Router } = require("express");
const router = Router();

const { getOrganizationMonitoring, aktSverka, orderOrganization, organizationPrixodRasxod } = require("./ozganization.monitoring.controller");

router.get('/akt/sverka', aktSverka)
router.get("/", getOrganizationMonitoring);
router.get('/order', orderOrganization)
router.get('/prixod/rasxod', organizationPrixodRasxod)


module.exports = router;
