const { Controller } = require("./controller");
const { validator } = require("@helper/validator");

const { Router } = require("express");
const router = Router();

router.get("/podpis-type", validator(Controller.getPodpisType));

module.exports = router;
