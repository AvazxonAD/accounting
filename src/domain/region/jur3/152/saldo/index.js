const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { Jur3SaldoSchema } = require("./schema");
const { Controller } = require("./controller");
const { check159Saldo } = require(`@middleware/check.saldo`);
const { Saldo159Service } = require(`@saldo_159/service`);

router
  .post("/", validator(Controller.create, Jur3SaldoSchema.create()))
  .post("/auto", validator(Controller.createAuto, Jur3SaldoSchema.createAuto()))
  .get(
    "/",
    check159Saldo(Saldo159Service.getDateSaldo),
    validator(Controller.get, Jur3SaldoSchema.get())
  )
  .delete(
    "/clean",
    validator(Controller.cleanData, Jur3SaldoSchema.cleanData())
  )
  .put(
    "/:id",
    check159Saldo(Saldo159Service.getDateSaldo),
    validator(Controller.update, Jur3SaldoSchema.update())
  )
  .delete(
    "/:id",
    check159Saldo(Saldo159Service.getDateSaldo),
    validator(Controller.delete, Jur3SaldoSchema.delete())
  )
  .get(
    "/:id",
    check159Saldo(Saldo159Service.getDateSaldo),
    validator(Controller.getById, Jur3SaldoSchema.getById())
  );

module.exports = router;
