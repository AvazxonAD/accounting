const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { KassaPrixodSchema } = require("./schema");
const { Controller } = require("./controller");
const { checkJur1Saldo } = require(`@middleware/check.saldo`);
const { KassaSaldoService } = require(`@jur1_saldo/service`);

router
  .post(
    "/",
    checkJur1Saldo(KassaSaldoService.getDateSaldo),
    validator(Controller.create, KassaPrixodSchema.create())
  )
  .get("/", validator(Controller.get, KassaPrixodSchema.get()))
  .put(
    "/:id",
    checkJur1Saldo(KassaSaldoService.getDateSaldo),
    validator(Controller.update, KassaPrixodSchema.update())
  )
  .delete(
    "/:id",
    checkJur1Saldo(KassaSaldoService.getDateSaldo),
    validator(Controller.delete, KassaPrixodSchema.delete())
  )
  .get("/:id", validator(Controller.getById, KassaPrixodSchema.getById()));

module.exports = router;
