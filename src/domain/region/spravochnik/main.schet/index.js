const { Router } = require("express");
const router = Router();

const { protect } = require("@middleware/auth");
const { Controller } = require(`./controller`);
const { validator } = require("@helper/validator");
const { MainSchetSchema } = require("./schema");

router
  .post("/", protect, validator(Controller.create, MainSchetSchema.create()))
  .put("/:id", protect, validator(Controller.update, MainSchetSchema.update()))
  .delete(
    "/:id",
    protect,
    validator(Controller.delete, MainSchetSchema.delete())
  )
  .get(
    "/budjet/region",
    protect,
    validator(Controller.getByBudjet, MainSchetSchema.getByBudjet())
  )

  .get(
    "/:id",
    protect,
    validator(Controller.getById, MainSchetSchema.getById())
  )

  .get("/", protect, validator(Controller.get, MainSchetSchema.get()));

module.exports = router;
