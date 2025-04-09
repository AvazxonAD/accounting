const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { BankMonitoringSchema } = require("./schema");
const { Controller } = require("./controller");
const { BankSaldoService } = require(`@jur2_saldo/service`);
const { checkJur2Saldo } = require(`@middleware/check.saldo`);

router
  .get(
    "/",
    checkJur2Saldo(BankSaldoService.getDateSaldo),
    validator(Controller.get, BankMonitoringSchema.get())
  )
  .get(
    "/daily",
    checkJur2Saldo(BankSaldoService.getDateSaldo),
    validator(Controller.daysReport, BankMonitoringSchema.daysReport())
  )
  .get(
    "/prixod",
    checkJur2Saldo(BankSaldoService.getDateSaldo),
    validator(Controller.prixodReport, BankMonitoringSchema.prixodReport())
  )
  .get(
    "/cap",
    checkJur2Saldo(BankSaldoService.getDateSaldo),
    validator(Controller.cap, BankMonitoringSchema.cap())
  );

module.exports = router;
