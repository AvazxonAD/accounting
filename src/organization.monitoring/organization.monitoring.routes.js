const { Router } = require("express");
const router = Router();

const { getMonitoring, aktSverka, orderOrganization, organizationPrixodRasxod, getBYOrganizationMonitoring } = require("./ozganization.monitoring.controller");

router.get('/akt/sverka', aktSverka)
router.get("/:id", getBYOrganizationMonitoring);
router.get("/", getMonitoring);
router.get('/order', orderOrganization)
router.get('/prixod/rasxod', organizationPrixodRasxod)


module.exports = router;
