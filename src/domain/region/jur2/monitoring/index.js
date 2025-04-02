const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { BankMonitoringSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .get("/", validator(Controller.get, BankMonitoringSchema.get()))
  .get(
    "/daily",
    validator(Controller.daysReport, BankMonitoringSchema.daysReport())
  )
  .get(
    "/prixod",
    validator(Controller.prixodReport, BankMonitoringSchema.prixodReport())
  )
  .get("/cap", validator(Controller.cap, BankMonitoringSchema.cap()));

module.exports = router;
