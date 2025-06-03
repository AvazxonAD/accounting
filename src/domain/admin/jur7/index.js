const { Router } = require("express");
const router = Router();

const { Controller } = require("./controller");
const { validator } = require("@helper/validator");

const { SaldoSchema } = require("./schema");

router.get("/", validator(Controller.get, SaldoSchema.get()));
router.get("/doc", validator(Controller.getDoc, SaldoSchema.getDoc()));

module.exports = router;
