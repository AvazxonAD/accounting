const { Router } = require("express");
const router = Router();

const { getPodotchetMonitoring, prixodRasxodPodotchet, podotchetMonitoring } = require("./podotchet.monitoring.controller");

router.get('/prixod/rasxod', prixodRasxodPodotchet)
router.get("/all", podotchetMonitoring);
router.get("/", getPodotchetMonitoring);


module.exports = router;
