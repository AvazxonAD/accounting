const { Router } = require("express");
const router = Router();
const { validator } = require('../helper/validator')
const { Controller } = require('./rasxod/controller')
const { paymentBankRasxod } = require('./rasxod/schema')

const {
  bank_rasxod,
  bank_rasxod_update,
  getAllBankRasxod,
  delete_bank_rasxod,
  getElementByIdBankRasxod,
  getFioBankRasxod
} = require("./bank.rasxod.controller");

router.get('/fio', getFioBankRasxod)
  .post("/", bank_rasxod)
  .put('/payment/:id', validator(Controller.paymentBankRasxod, paymentBankRasxod))
  .put("/:id", bank_rasxod_update)
  .get("/", getAllBankRasxod)
  .delete("/:id", delete_bank_rasxod)
  .get("/:id", getElementByIdBankRasxod);

module.exports = router;
