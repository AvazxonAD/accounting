const { Router } = require("express");
const router = Router();

const { getPodotchetMonitoring } = require("../../controller/podotchet/podotchet.monitoring.controller");

router.get("/", getPodotchetMonitoring);

module.exports = router;
