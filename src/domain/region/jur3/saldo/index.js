const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { Jur3SaldoSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .post("/", validator(Controller.create, Jur3SaldoSchema.create()))
  .post("/auto", validator(Controller.createAuto, Jur3SaldoSchema.createAuto()))
  .get("/", validator(Controller.get, Jur3SaldoSchema.get()))
  .get(
    "/date",
    validator(Controller.getDateSaldo, Jur3SaldoSchema.getDateSaldo())
  )
  .delete(
    "/clean",
    validator(Controller.cleanData, Jur3SaldoSchema.cleanData())
  )
  .get("/", validator(Controller.getByMonth, Jur3SaldoSchema.get()))
  .put("/:id", validator(Controller.update, Jur3SaldoSchema.update()))
  .delete("/:id", validator(Controller.delete, Jur3SaldoSchema.delete()))
  .get("/:id", validator(Controller.getById, Jur3SaldoSchema.getById()));

module.exports = router;
