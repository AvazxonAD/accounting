const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { Jur3SaldoSchema } = require("./schema");
const { Controller } = require("./controller");
const { checkJur4Saldo } = require(`@middleware/check.saldo`);
const { Jur4SaldoService } = require(`@podotchet_saldo/service`);

router
  .post(
    "/",
    checkJur4Saldo(Jur4SaldoService.getDateSaldo),
    validator(Controller.create, Jur3SaldoSchema.create())
  )
  .get(
    "/",
    checkJur4Saldo(Jur4SaldoService.getDateSaldo),
    validator(Controller.get, Jur3SaldoSchema.get())
  )
  .get("/data", validator(Controller.getData, Jur3SaldoSchema.getData()))
  .get(
    "/first",
    validator(Controller.getFirstSaldo, Jur3SaldoSchema.getFirstSaldo())
  )
  .delete(
    "/clean",
    validator(Controller.cleanData, Jur3SaldoSchema.cleanData())
  )
  .put("/:id", validator(Controller.update, Jur3SaldoSchema.update()))
  .delete(
    "/:id",
    checkJur4Saldo(Jur4SaldoService.getDateSaldo),
    validator(Controller.delete, Jur3SaldoSchema.delete())
  )
  .get("/:id", validator(Controller.getById, Jur3SaldoSchema.getById()));

module.exports = router;
