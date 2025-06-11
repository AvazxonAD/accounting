const { Controller } = require("./controller");
const { ConstanstsSchema } = require("./schema");
const { validator } = require("@helper/validator");

const { Router } = require("express");
const router = Router();

router.get("/podpis-type", validator(Controller.getPodpisType));
router.get("/regions", validator(Controller.getRegions));
router.get("/districts", validator(Controller.getDistricts, ConstanstsSchema.getDistricts()));

module.exports = router;
