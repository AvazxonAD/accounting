const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const { MinimumWageSchema } = require("./schema");

const { Router } = require("express");
const router = Router();

router.put("/", validator(Controller.update, MinimumWageSchema.update()));
router.get("/", validator(Controller.get, MinimumWageSchema.get()));

module.exports = router;
