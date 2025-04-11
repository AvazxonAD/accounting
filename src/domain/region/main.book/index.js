const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { MainBookSchema } = require("./schema");
const { Controller } = require("./controller");
const { checkMainBook } = require("@middleware/check.saldo");
const { MainBookService } = require(`./service`);

router
  .post(
    "/",
    checkMainBook(MainBookService.getCheck),
    validator(Controller.create, MainBookSchema.create())
  )
  .get(
    "/",
    checkMainBook(MainBookService.getCheck),
    validator(Controller.get, MainBookSchema.get())
  )
  .delete("/clean", validator(Controller.cleanData, MainBookSchema.cleanData()))
  .get("/docs", validator(Controller.getDocs, MainBookSchema.getDocs()))
  .get(
    "/unique",
    validator(Controller.getUniqueSchets, MainBookSchema.getUniqueSchets())
  )
  .get(
    "/check",
    validator(Controller.getCheckFirst, MainBookSchema.getCheckFirst())
  )
  .get("/type", validator(Controller.getMainBookType))
  .get("/data", validator(Controller.getData, MainBookSchema.getData()))
  .put("/:id", validator(Controller.update, MainBookSchema.update()))
  .delete("/:id", validator(Controller.delete, MainBookSchema.delete()))
  .get("/:id", validator(Controller.getById, MainBookSchema.getById()));

module.exports = router;
