const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { Jur3SaldoSchema } = require("./schema");
const { Controller } = require("./controller");
const { checkJur3Saldo } = require(`@middleware/check.saldo`);
const { Jur3SaldoService } = require(`@organ_saldo/service`);

router
  .post("/", validator(Controller.create, Jur3SaldoSchema.create()))
  .post("/auto", validator(Controller.createAuto, Jur3SaldoSchema.createAuto()))
  .get(
    "/",
    checkJur3Saldo(Jur3SaldoService.getDateSaldo),
    validator(Controller.get, Jur3SaldoSchema.get())
  )
  .delete(
    "/clean",
    checkJur3Saldo(Jur3SaldoService.getDateSaldo),
    validator(Controller.cleanData, Jur3SaldoSchema.cleanData())
  )
  .get(
    "/",
    checkJur3Saldo(Jur3SaldoService.getDateSaldo),
    validator(Controller.getByMonth, Jur3SaldoSchema.get())
  )
  .put(
    "/:id",
    checkJur3Saldo(Jur3SaldoService.getDateSaldo),
    validator(Controller.update, Jur3SaldoSchema.update())
  )
  .delete(
    "/:id",
    checkJur3Saldo(Jur3SaldoService.getDateSaldo),
    validator(Controller.delete, Jur3SaldoSchema.delete())
  )
  .get(
    "/:id",
    checkJur3Saldo(Jur3SaldoService.getDateSaldo),
    validator(Controller.getById, Jur3SaldoSchema.getById())
  );

module.exports = router;
