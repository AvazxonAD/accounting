const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { Jur8MonitoringSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .get("/", validator(Controller.get, Jur8MonitoringSchema.get()))
  .put("/:id", validator(Controller.update, Jur8MonitoringSchema.update()))
  .delete("/:id", validator(Controller.delete, Jur8MonitoringSchema.delete()))
  .get("/data", validator(Controller.getData, Jur8MonitoringSchema.getData()))
  .get("/:id", validator(Controller.getById, Jur8MonitoringSchema.getById()))
  .post("/", validator(Controller.create, Jur8MonitoringSchema.create()));

module.exports = router;
