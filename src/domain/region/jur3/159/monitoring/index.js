const { Controller } = require("./controllers");
const { validator } = require("@helper/validator");

const {
  monitoringSchema,
  prixodRasxodSchema,
  capSchema,
  consolidatedSchema,
  Monitoring159Schema,
} = require("./schema");

const { Router } = require("express");
const router = Router();

router
  .get("/", validator(Controller.monitoring, monitoringSchema))
  .get("/cap", validator(Controller.cap, capSchema))

  .get(
    "/daily",
    validator(Controller.daysReport, Monitoring159Schema.daysReport())
  )
  .get(
    "/prixod/rasxod",
    validator(Controller.prixodRasxod, prixodRasxodSchema)
  );

module.exports = router;
