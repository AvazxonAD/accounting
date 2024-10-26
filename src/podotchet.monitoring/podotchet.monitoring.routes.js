const { Router } = require("express");
const router = Router();

const { getPodotchetMonitoring } = require("./podotchet.monitoring.controller");

router.get("/", getPodotchetMonitoring);

module.exports = router;
