const { Router } = require("express");
const router = Router();

const { getOrganizationMonitoring } = require("./ozganization.monitoring.controller");

router.get("/", getOrganizationMonitoring);

module.exports = router;
