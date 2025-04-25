const { Router } = require("express");
const router = Router();

const {
  monitoringSchema,
  prixodRasxodSchema,
  getByIdPodotchetToExcelSchema,
  capSchema,
  PodotchetMonitoringSchema,
} = require("./schemas");
const { Controller } = require("./controllers");
const { validator } = require("@helper/validator");

router
  .get("/", validator(Controller.getMonitoring, monitoringSchema))
  .get(
    "/prixod/rasxod",
    validator(Controller.prixodRasxodPodotchet, prixodRasxodSchema)
  )

  .get(
    "/daily",
    validator(Controller.daysReport, PodotchetMonitoringSchema.daysReport())
  )
  .get("/cap", validator(Controller.cap, capSchema));

module.exports = router;
