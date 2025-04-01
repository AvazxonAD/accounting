const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const { FeaturesSchema } = require("./schema");

const { Router } = require("express");
const router = Router();

router
  .get(
    "/check/schets",
    validator(Controller.checkSchets, FeaturesSchema.checkSchets())
  )
  .get(
    "/doc/num/:page",
    validator(Controller.getDocNum, FeaturesSchema.docNum())
  );

module.exports = router;
