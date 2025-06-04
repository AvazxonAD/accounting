const { Router } = require("express");
const router = Router();

const { Controller } = require("./controller");
const { validator } = require("@helper/validator");

const { SaldoSchema } = require("./schema");

const { uploadExcel } = require("@helper/upload");
const { Middleware } = require("@middleware/index");

router
  .post("/import", Middleware.jur7Block, uploadExcel.single("file"), validator(Controller.import, SaldoSchema.import()))

  .get("/product", Middleware.jur7Block, validator(Controller.getByProduct, SaldoSchema.getByProduct()))

  .get("/check-create", Middleware.jur7Block, validator(Controller.checkFirst, SaldoSchema.checkFirst()))

  .delete("/by-group", Middleware.jur7Block, validator(Controller.deleteByGroup, SaldoSchema.deleteByGroup()))

  .delete("/", Middleware.jur7Block, validator(Controller.delete, SaldoSchema.delete()))

  .delete("/clean", validator(Controller.cleanData, SaldoSchema.cleanData()))

  .post("/by-group", validator(Controller.createByGroup, SaldoSchema.createByGroup()))
  .post("/", validator(Controller.create, SaldoSchema.create()))

  .get("/template", validator(Controller.templateFile))

  .get("/check", validator(Controller.check, SaldoSchema.check()))

  .get("/:id", validator(Controller.getById, SaldoSchema.getById()));

module.exports = router;
