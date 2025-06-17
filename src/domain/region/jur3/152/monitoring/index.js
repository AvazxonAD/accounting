const { Controller } = require("./controllers");
const { validator } = require("@helper/validator");

const { monitoringSchema, prixodRasxodSchema, capSchema, consolidatedSchema, Monitoring152Schema } = require("./schema");

const { Router } = require("express");
const router = Router();

router
  .get("/", validator(Controller.monitoring, monitoringSchema))
  .get("/cap", validator(Controller.cap, capSchema))
  .get("/by-schets", validator(Controller.reportBySchets, Monitoring152Schema.reportBySchets()))
  .get("/daily", validator(Controller.daysReport, Monitoring152Schema.daysReport()))
  .get("/akt/sverka", validator(Controller.aktSverka, Monitoring152Schema.aktSverka()))
  .get("/prixod/rasxod", validator(Controller.prixodRasxod, prixodRasxodSchema))
  .get("/prixod", validator(Controller.prixodReport, Monitoring152Schema.prixodReport()));

module.exports = router;
