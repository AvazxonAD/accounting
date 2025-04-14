const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { Jur4SaldoSchema } = require("./schema");
const { Controller } = require("./controller");
const { checkJur4Saldo } = require(`@middleware/check.saldo`);
const { Jur4SaldoService } = require(`@podotchet_saldo/service`);

router
  .post("/", validator(Controller.create, Jur4SaldoSchema.create()))
  .post("/auto", validator(Controller.createAuto, Jur4SaldoSchema.createAuto()))
  .get(
    "/",
    checkJur4Saldo(Jur4SaldoService.getSaldoDate),
    validator(Controller.get, Jur4SaldoSchema.get())
  )
  .get(
    "/date",
    checkJur4Saldo(Jur4SaldoService.getSaldoDate),
    validator(Controller.getDateSaldo, Jur4SaldoSchema.getDateSaldo())
  )
  .delete(
    "/clean",
    validator(Controller.cleanData, Jur4SaldoSchema.cleanData())
  )
  .put(
    "/:id",
    checkJur4Saldo(Jur4SaldoService.getSaldoDate),
    validator(Controller.update, Jur4SaldoSchema.update())
  )
  .delete(
    "/:id",
    checkJur4Saldo(Jur4SaldoService.getSaldoDate),
    validator(Controller.delete, Jur4SaldoSchema.delete())
  )
  .get(
    "/:id",
    checkJur4Saldo(Jur4SaldoService.getSaldoDate),
    validator(Controller.getById, Jur4SaldoSchema.getById())
  );

module.exports = router;
