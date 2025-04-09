const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { BankRasxodSchema } = require("./schema");
const { Controller } = require("./controller");
const { checkJur2Saldo } = require(`@middleware/check.saldo`);
const { BankSaldoService } = require(`@jur2_saldo/service`);

router
  .post("/", validator(Controller.create, BankRasxodSchema.create()))
  .post("/import", validator(Controller.import, BankRasxodSchema.importData()))
  .get("/", validator(Controller.get, BankRasxodSchema.get()))
  .put(
    "/payment/:id",
    validator(Controller.payment, BankRasxodSchema.payment())
  )
  .get("/fio", validator(Controller.fio, BankRasxodSchema.fio()))
  .put("/:id", validator(Controller.update, BankRasxodSchema.update()))
  .delete("/:id", validator(Controller.delete, BankRasxodSchema.delete()))
  .get("/:id", validator(Controller.getById, BankRasxodSchema.getById()));

module.exports = router;
