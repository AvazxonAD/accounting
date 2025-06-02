const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { Jur2MonitoringSchema } = require("./schema");
const { Controller } = require("./controller");

router.get("/", validator(Controller.get, Jur2MonitoringSchema.get()));

module.exports = router;
