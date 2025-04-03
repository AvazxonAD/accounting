const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { KassaRasxodSchema } = require("./schema");
const { Controller } = require("./controller");
const { checkJur1Saldo } = require(`@middleware/check.saldo`);
const { KassaSaldoService } = require(`@jur1_saldo/service`);

router
  .post(
    "/",
    checkJur1Saldo(KassaSaldoService.getDateSaldo),
    validator(Controller.create, KassaRasxodSchema.create())
  )
  .get("/", validator(Controller.get, KassaRasxodSchema.get()))
  .put(
    "/:id",
    checkJur1Saldo(KassaSaldoService.getDateSaldo),
    validator(Controller.update, KassaRasxodSchema.update())
  )
  .delete(
    "/:id",
    checkJur1Saldo(KassaSaldoService.getDateSaldo),
    validator(Controller.delete, KassaRasxodSchema.delete())
  )
  .get("/:id", validator(Controller.getById, KassaRasxodSchema.getById()));

module.exports = router;
