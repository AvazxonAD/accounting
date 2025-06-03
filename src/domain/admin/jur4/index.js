const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { Jur4MonitoringSchema } = require("./schema");
const { Controller } = require("./controller");

router.get("/", validator(Controller.get, Jur4MonitoringSchema.get()));

module.exports = router;
