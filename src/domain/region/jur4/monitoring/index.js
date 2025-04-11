const { Router } = require("express");
const router = Router();

const {
  monitoringSchema,
  prixodRasxodSchema,
  getByIdPodotchetToExcelSchema,
  capSchema,
} = require("./schemas");
const { Controller } = require("./controllers");
const { validator } = require("@helper/validator");
const { checkJur4Saldo } = require(`@middleware/check.saldo`);
const { Jur4SaldoService } = require(`@podotchet_saldo/service`);

router
  .get(
    "/",
    checkJur4Saldo(Jur4SaldoService.getDateSaldo),
    validator(Controller.getMonitoring, monitoringSchema)
  )
  .get(
    "/prixod/rasxod",
    checkJur4Saldo(Jur4SaldoService.getDateSaldo),
    validator(Controller.prixodRasxodPodotchet, prixodRasxodSchema)
  )
  .get(
    "/cap",
    checkJur4Saldo(Jur4SaldoService.getDateSaldo),
    validator(Controller.cap, capSchema)
  )
  .get(
    "/export/:id",
    checkJur4Saldo(Jur4SaldoService.getDateSaldo),
    validator(Controller.getByIdPodotchetToExcel, getByIdPodotchetToExcelSchema)
  );

module.exports = router;
