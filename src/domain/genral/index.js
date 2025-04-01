const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const { GeneralSchema } = require("./schema");

const { Router } = require("express");
const router = Router();
const { protect } = require(`@middleware/auth`);

router.get(
  "/video/watch/:id",
  validator(Controller.getWatch, GeneralSchema.getVideoWatch())
);

module.exports = router;
