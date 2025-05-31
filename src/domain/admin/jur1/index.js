const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { KassaMonitoringSchema } = require("./schema");
const { Controller } = require("./controller");

router.get("/", validator(Controller.get, KassaMonitoringSchema.get()));

module.exports = router;
