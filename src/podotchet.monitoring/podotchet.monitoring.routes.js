const { Router } = require("express");
const router = Router();

const { getPodotchetMonitoring, prixodRasxodPodotchet } = require("./podotchet.monitoring.controller");

router.get("/", getPodotchetMonitoring);
router.get('/prixod/rasxod', prixodRasxodPodotchet)


module.exports = router;
