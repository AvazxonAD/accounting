const { Router } = require("express");
const router = Router();

const { protect } = require("@middleware/auth");
const { Controller } = require(`./controller`);
const { validator } = require("@helper/validator");
const { MainSchetSchema } = require("./schema");

router
  .post("/", protect, validator(Controller.create, MainSchetSchema.create()))
  .get("/:id", protect, validator(Controller.getb))
  .get("/", protect, validator(Controller.get, MainSchetSchema.get()));

const {
  create,
  getAll,
  update,
  deleteValue,
  getElementById,
  getByBudjetIdMainSchet,
} = require("./main_schet.controller");

router
  .put("/:id", protect, update)
  .delete("/:id", protect, deleteValue)
  .get("/budjet/region/", getByBudjetIdMainSchet);

module.exports = router;
