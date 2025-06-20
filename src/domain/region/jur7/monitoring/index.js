const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const { Schema } = require("./schema");

const { Router } = require("express");
const router = Router();

router
  .get("/cap/report", validator(Controller.cap, Schema.capSchema()))
  .get("/by-schets", validator(Controller.reportBySchetsData, Schema.reportBySchetsData()))
  .get("/", validator(Controller.monitoring, Schema.monitoring()))
  .get("/days-report", validator(Controller.daysReport, Schema.daysReport()))
  .get("/schet", validator(Controller.reportBySchets, Schema.reportBySchets()))
  .get("/saldo/date", validator(Controller.getSaldoDate, Schema.getSaldoDate()))
  .get("/material/report", validator(Controller.materialReport, Schema.getMaterialSchema()))
  .get("/turnover/report", validator(Controller.turnoverReport, Schema.turnoverReport()))
  .get("/act/report", validator(Controller.act, Schema.act()));

module.exports = router;
