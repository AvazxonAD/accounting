const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { BankPrixodSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .post("/", validator(Controller.create, BankPrixodSchema.create()))
  .get("/", validator(Controller.get, BankPrixodSchema.get()))
  .put("/:id", validator(Controller.update, BankPrixodSchema.update()))
  .delete("/:id", validator(Controller.delete, BankPrixodSchema.delete()))
  .get("/:id", validator(Controller.getById, BankPrixodSchema.getById()));

module.exports = router;
