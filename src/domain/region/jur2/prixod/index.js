const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { BankPrixodSchema } = require("./schema");
const { Controller } = require("./controller");
const { checkJur2Saldo } = require(`@middleware/check.saldo`);
const { BankSaldoService } = require(`@jur2_saldo/service`);

router
  .post(
    "/",
    checkJur2Saldo(BankSaldoService.getDateSaldo),
    validator(Controller.create, BankPrixodSchema.create())
  )
  .get("/", validator(Controller.get, BankPrixodSchema.get()))
  .put(
    "/:id",
    checkJur2Saldo(BankSaldoService.getDateSaldo),
    validator(Controller.update, BankPrixodSchema.update())
  )
  .delete(
    "/:id",
    checkJur2Saldo(BankSaldoService.getDateSaldo),
    validator(Controller.delete, BankPrixodSchema.delete())
  )
  .get("/:id", validator(Controller.getById, BankPrixodSchema.getById()));

module.exports = router;
