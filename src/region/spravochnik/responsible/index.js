const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const {
  createResponsibleSchema,
  getResponsibleSchema,
  updateResponsibleSchema,
  getByIdResponsibleSchema,
  deleteResponsibleSchema,
  ResponsibleSchema,
} = require("./schema");

const { uploadExcel } = require("@helper/upload");

const { Router } = require("express");
const router = Router();

router
  .post("/", validator(Controller.createResponsible, createResponsibleSchema))
  .post(
    "/import",
    uploadExcel.single("file"),
    validator(Controller.import, ResponsibleSchema.importFile())
  )
  .get("/template", validator(Controller.template))
  .get("/:id", validator(Controller.getById, getByIdResponsibleSchema))
  .put("/:id", validator(Controller.updateResponsible, updateResponsibleSchema))
  .delete(
    "/:id",
    validator(Controller.deleteResponsible, deleteResponsibleSchema)
  )
  .get("/", validator(Controller.get, getResponsibleSchema));

module.exports = router;
