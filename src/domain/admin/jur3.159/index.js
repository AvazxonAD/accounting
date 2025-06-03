const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { Jur3152MonitoringSchema } = require("./schema");
const { Controller } = require("./controller");

router.get("/", validator(Controller.get, Jur3152MonitoringSchema.get()));

module.exports = router;
