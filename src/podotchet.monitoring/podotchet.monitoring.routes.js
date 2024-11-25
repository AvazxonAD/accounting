const { Router } = require("express");
const router = Router();

const { getByPodotchetIdMonitoring, prixodRasxodPodotchet, getMonitoring, getByPodotchetIdMonitoringToExcel } = require("./podotchet.monitoring.controller");

router.get('/prixod/rasxod', prixodRasxodPodotchet);
router.get("/", getMonitoring);
router.get("/:id", getByPodotchetIdMonitoring);
router.get("/export/:id", getByPodotchetIdMonitoringToExcel);



module.exports = router;
