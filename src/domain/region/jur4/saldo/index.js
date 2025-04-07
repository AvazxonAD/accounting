const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { Jur4SaldoSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .post("/", validator(Controller.create, Jur4SaldoSchema.create()))
  .post("/auto", validator(Controller.createAuto, Jur4SaldoSchema.createAuto()))
  .get("/", validator(Controller.get, Jur4SaldoSchema.get()))
  .get(
    "/date",
    validator(Controller.getDateSaldo, Jur4SaldoSchema.getDateSaldo())
  )
  .delete(
    "/clean",
    validator(Controller.cleanData, Jur4SaldoSchema.cleanData())
  )
  .get("/", validator(Controller.getByMonth, Jur4SaldoSchema.get()))
  .put("/:id", validator(Controller.update, Jur4SaldoSchema.update()))
  .delete("/:id", validator(Controller.delete, Jur4SaldoSchema.delete()))
  .get("/:id", validator(Controller.getById, Jur4SaldoSchema.getById()));

module.exports = router;
