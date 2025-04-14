const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { Saldo152Schema } = require("./schema");
const { Controller } = require("./controller");
const { check152Saldo } = require(`@middleware/check.saldo`);
const { Saldo152Service } = require(`./service`);

router
  .post(
    "/",
    check152Saldo(Saldo152Service.getDateSaldo),
    validator(Controller.create, Saldo152Schema.create())
  )
  .get(
    "/",
    check152Saldo(Saldo152Service.getDateSaldo),
    validator(Controller.get, Saldo152Schema.get())
  )
  .get("/data", validator(Controller.getData, Saldo152Schema.getData()))
  .get(
    "/first",
    validator(Controller.getFirstSaldo, Saldo152Schema.getFirstSaldo())
  )
  .delete("/clean", validator(Controller.cleanData, Saldo152Schema.cleanData()))
  .put("/:id", validator(Controller.update, Saldo152Schema.update()))
  .delete(
    "/:id",
    check152Saldo(Saldo152Service.getDateSaldo),
    validator(Controller.delete, Saldo152Schema.delete())
  )
  .get("/:id", validator(Controller.getById, Saldo152Schema.getById()));

module.exports = router;
