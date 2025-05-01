const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const { DashboardSchema } = require("./schema");

const { Router } = require("express");
const router = Router();

router
  .get("/budjet", validator(Controller.budjet))
  .get("/kassa", validator(Controller.kassa, DashboardSchema.kassa()))
  .get(
    "/podotchet",
    validator(Controller.podotchet, DashboardSchema.podotchet())
  )
  .get("/bank", validator(Controller.bank, DashboardSchema.bank()));

module.exports = router;
