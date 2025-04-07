const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { KassaSaldoSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .post("/", validator(Controller.create, KassaSaldoSchema.create()))
  .post(
    "/auto",
    validator(Controller.createAuto, KassaSaldoSchema.createAuto())
  )
  .get("/", validator(Controller.get, KassaSaldoSchema.get()))
  .get(
    "/date",
    validator(Controller.getDateSaldo, KassaSaldoSchema.getDateSaldo())
  )
  .put("/:id", validator(Controller.update, KassaSaldoSchema.update()))
  .delete("/:id", validator(Controller.delete, KassaSaldoSchema.delete()))
  .get("/:id", validator(Controller.getById, KassaSaldoSchema.getById()));

module.exports = router;
