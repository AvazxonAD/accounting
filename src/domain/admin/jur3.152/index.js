const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { Jur3159MonitoringSchema } = require("./schema");
const { Controller } = require("./controller");

router.get("/", validator(Controller.get, Jur3159MonitoringSchema.get()));

module.exports = router;
