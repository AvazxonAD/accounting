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

  // old
  .get(
    "/prixod",
    validator(Controller.prixodReport, Monitoring159Schema.prixodReport())
  )
  .get("/prixod/rasxod", validator(Controller.prixodRasxod, prixodRasxodSchema))
  .get("/order", validator(Controller.consolidated, consolidatedSchema));
// .get("/akt/sverka", validator(Controller.aktSverka, aktSverkaSchema));

module.exports = router;
