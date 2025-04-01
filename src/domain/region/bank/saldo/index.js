const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { BankSaldoSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .post("/", validator(Controller.create, BankSaldoSchema.create()))
  .get("/", validator(Controller.get, BankSaldoSchema.get()))
  .put("/:id", validator(Controller.update, BankSaldoSchema.update()))
  .delete("/:id", validator(Controller.delete, BankSaldoSchema.delete()))
  .get("/:id", validator(Controller.getById, BankSaldoSchema.getById()));

module.exports = router;
