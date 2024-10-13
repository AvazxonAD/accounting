const { Router } = require("express");
const router = Router();

const { getOrganizationMonitoring } = require("../../controller/organization/ozganization.controller");

router.get("/", getOrganizationMonitoring);

module.exports = router;
