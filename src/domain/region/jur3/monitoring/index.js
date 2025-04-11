const { Controller } = require("./controllers");
const { validator } = require("@helper/validator");

const {
  monitoringSchema,
  prixodRasxodSchema,
  capSchema,
  consolidatedSchema,
  OrganMonitoringSchema,
} = require("./schema");

const { Router } = require("express");
const router = Router();
const { checkJur3Saldo } = require(`@middleware/check.saldo`);
const { Jur3SaldoService } = require(`@organ_saldo/service`);

router
  .get(
    "/cap",
    checkJur3Saldo(Jur3SaldoService.getDateSaldo),
    validator(Controller.cap, capSchema)
  )
  .get(
    "/",
    checkJur3Saldo(Jur3SaldoService.getDateSaldo),
    validator(Controller.monitoring, monitoringSchema)
  )
  .get(
    "/prixod",
    checkJur3Saldo(Jur3SaldoService.getDateSaldo),
    validator(Controller.prixodReport, OrganMonitoringSchema.prixodReport())
  )
  .get("/prixod/rasxod", validator(Controller.prixodRasxod, prixodRasxodSchema))
  .get("/order", validator(Controller.consolidated, consolidatedSchema));
// .get("/akt/sverka", validator(Controller.aktSverka, aktSverkaSchema));

module.exports = router;
