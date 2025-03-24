const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const { uploadExcel } = require("@helper/upload");
const {
  createSchema,
  getSchema,
  updateSchema,
  getByIdGroupSchema,
  deleteSchema,
  GroupSchema,
} = require("./schema");

const { Router } = require("express");
const router = Router();

router
  .get("/percent", Controller.getWithPercent)
  .get("/template", validator(Controller.templateFile))
  .get("/export", validator(Controller.export))
  .post(
    "/import",
    uploadExcel.single("file"),
    validator(Controller.import, GroupSchema.import())
  )
  .post("/", validator(Controller.create, createSchema))
  .get("/:id", validator(Controller.getById, getByIdGroupSchema))
  .put("/:id", validator(Controller.update, updateSchema))
  .delete("/:id", validator(Controller.delete, deleteSchema))
  .get("/", validator(Controller.get, getSchema));

module.exports = router;
