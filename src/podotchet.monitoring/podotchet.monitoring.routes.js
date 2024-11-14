const { Router } = require("express");
const router = Router();

const { getPodotchetMonitoring, prixodRasxodPodotchet } = require("./podotchet.monitoring.controller");

router.get('/prixod/rasxod', prixodRasxodPodotchet)
router.get("/", getPodotchetMonitoring);


module.exports = router;
