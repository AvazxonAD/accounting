const { Router } = require("express");
const router = Router();

const {
  monitoringSchema,
  prixodRasxodSchema,
  getByIdPodotchetToExcelSchema,
  capSchema,
} = require("./schemas");
const { Controller } = require("./controllers");
const { validator } = require("@helper/validator");

router
  .get("/", validator(Controller.getMonitoring, monitoringSchema))
  .get(
    "/prixod/rasxod",
    validator(Controller.prixodRasxodPodotchet, prixodRasxodSchema)
  )
  .get("/cap", validator(Controller.cap, capSchema))
  .get(
    "/export/:id",
    validator(Controller.getByIdPodotchetToExcel, getByIdPodotchetToExcelSchema)
  );

module.exports = router;
