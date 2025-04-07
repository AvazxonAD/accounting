const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { BankSaldoSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .post("/", validator(Controller.create, BankSaldoSchema.create()))
  .post("/auto", validator(Controller.createAuto, BankSaldoSchema.createAuto()))
  .get("/", validator(Controller.get, BankSaldoSchema.get()))
  .get(
    "/date",
    validator(Controller.getDateSaldo, BankSaldoSchema.getDateSaldo())
  )
  .delete(
    "/clean",
    validator(Controller.cleanData, BankSaldoSchema.cleanData())
  )
  .get("/", validator(Controller.getByMonth, BankSaldoSchema.get()))
  .put("/:id", validator(Controller.update, BankSaldoSchema.update()))
  .delete("/:id", validator(Controller.delete, BankSaldoSchema.delete()))
  .get("/:id", validator(Controller.getById, BankSaldoSchema.getById()));

module.exports = router;
