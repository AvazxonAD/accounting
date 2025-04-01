const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const {
  createBankSchema,
  getBankSchema,
  updateBankSchema,
  getByIdBankSchema,
  deleteBankSchema,
  BankSchema,
} = require("./schema");

const { uploadExcel } = require("@helper/upload");
const { Router } = require("express");
const router = Router();

router
  .post("/", validator(Controller.create, createBankSchema))
  .get("/:id", validator(Controller.getByIdBankMfo, getByIdBankSchema))
  .put("/:id", validator(Controller.updateBankMfo, updateBankSchema))
  .delete("/:id", validator(Controller.deleteBankMfo, deleteBankSchema))
  .get("/", validator(Controller.getBankMfo, getBankSchema))
  .post(
    "/import",
    uploadExcel.single("file"),
    validator(Controller.importExcelData)
  );

module.exports = router;
