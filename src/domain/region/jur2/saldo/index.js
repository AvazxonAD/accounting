const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { BankSaldoSchema } = require("./schema");
const { Controller } = require("./controller");

const { checkJur2Saldo } = require(`@middleware/check.saldo`);
const { BankSaldoService } = require(`@jur2_saldo/service`);

router
  .post("/", validator(Controller.create, BankSaldoSchema.create()))
  .post("/auto", validator(Controller.createAuto, BankSaldoSchema.createAuto()))
  .get(
    "/",
    checkJur2Saldo(BankSaldoService.getDateSaldo),
    validator(Controller.get, BankSaldoSchema.get())
  )
  .delete(
    "/clean",
    checkJur2Saldo(BankSaldoService.getDateSaldo),
    validator(Controller.cleanData, BankSaldoSchema.cleanData())
  )
  .get(
    "/",
    checkJur2Saldo(BankSaldoService.getDateSaldo),
    validator(Controller.getByMonth, BankSaldoSchema.get())
  )
  .put(
    "/:id",
    checkJur2Saldo(BankSaldoService.getDateSaldo),
    validator(Controller.update, BankSaldoSchema.update())
  )
  .delete(
    "/:id",
    checkJur2Saldo(BankSaldoService.getDateSaldo),
    validator(Controller.delete, BankSaldoSchema.delete())
  )
  .get(
    "/:id",
    checkJur2Saldo(BankSaldoService.getDateSaldo),
    validator(Controller.getById, BankSaldoSchema.getById())
  );

module.exports = router;
