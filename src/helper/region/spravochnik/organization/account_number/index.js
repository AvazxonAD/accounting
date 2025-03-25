const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const { AccountNumberSchema } = require("./schema");

const { Router } = require("express");
const router = Router();

const { uploadExcel } = require("@helper/upload");

router
  .post("/", validator(Controller.create, AccountNumberSchema.create()))
  .post(
    "/import",
    uploadExcel.single("file"),
    validator(Controller.import, AccountNumberSchema.import())
  )
  .get("/template", validator(Controller.template))
  .get("/:id", validator(Controller.getById, AccountNumberSchema.getById()))
  .put("/:id", validator(Controller.update, AccountNumberSchema.update()))
  .delete("/:id", validator(Controller.delete, AccountNumberSchema.delette()))
  .get("/", validator(Controller.get, AccountNumberSchema.get()));

module.exports = router;
