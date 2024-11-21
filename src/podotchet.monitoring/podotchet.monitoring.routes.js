const { Router } = require("express");
const router = Router();

const { getByPodotchetIdMonitoring, prixodRasxodPodotchet, getMonitoring } = require("./podotchet.monitoring.controller");

router.get('/prixod/rasxod', prixodRasxodPodotchet)
router.get("/", getMonitoring);
router.get("/:id", getByPodotchetIdMonitoring);



module.exports = router;
