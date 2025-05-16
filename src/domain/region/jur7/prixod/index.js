const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const { uploadExcel } = require("@helper/upload");
const { PrixodJur7Schema } = require("./schema");
const { Middleware } = require(`@middleware/index`);

const { Router } = require("express");
const router = Router();

router
  .get(
    "/docs/:id",
    Middleware.jur7Block,
    validator(Controller.rasxodDocs, PrixodJur7Schema.rasxodDocs())
  )
  .get(
    "/report",
    Middleware.jur7Block,
    validator(Controller.getPrixodReport, PrixodJur7Schema.report())
  )
  .get("/template", validator(Controller.templateImport))
  .post(
    "/",
    Middleware.jur7Block,
    validator(Controller.create, PrixodJur7Schema.create())
  )
  .post(
    "/read",
    uploadExcel.single("file"),
    validator(Controller.readFile, PrixodJur7Schema.readFile())
  )
  .get(
    "/:id",
    Middleware.jur7Block,
    validator(Controller.getById, PrixodJur7Schema.getById())
  )
  .put(
    "/:id",
    Middleware.jur7Block,
    validator(Controller.update, PrixodJur7Schema.update())
  )
  .delete(
    "/:id",
    Middleware.jur7Block,
    validator(Controller.delete, PrixodJur7Schema.delete())
  )
  .get(
    "/",
    Middleware.jur7Block,
    validator(Controller.get, PrixodJur7Schema.get())
  );

module.exports = router;
