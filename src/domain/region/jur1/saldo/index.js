const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { KassaSaldoSchema } = require("./schema");
const { Controller } = require("./controller");

const { checkJur1Saldo } = require(`@middleware/check.saldo`);
const { KassaSaldoService } = require(`@jur1_saldo/service`);

router
  .post("/", validator(Controller.create, KassaSaldoSchema.create()))
  .post(
    "/auto",
    validator(Controller.createAuto, KassaSaldoSchema.createAuto())
  )
  .get(
    "/",
    checkJur1Saldo(KassaSaldoService.getDateSaldo),
    validator(Controller.get, KassaSaldoSchema.get())
  )
  .put(
    "/:id",
    checkJur1Saldo(KassaSaldoService.getDateSaldo),
    validator(Controller.update, KassaSaldoSchema.update())
  )
  .delete(
    "/clean",
    checkJur1Saldo(KassaSaldoService.getDateSaldo),
    validator(Controller.cleanData, KassaSaldoSchema.cleanData())
  )
  .delete(
    "/:id",
    checkJur1Saldo(KassaSaldoService.getDateSaldo),
    validator(Controller.delete, KassaSaldoSchema.delete())
  )
  .get(
    "/:id",
    checkJur1Saldo(KassaSaldoService.getDateSaldo),
    validator(Controller.getById, KassaSaldoSchema.getById())
  );

module.exports = router;
