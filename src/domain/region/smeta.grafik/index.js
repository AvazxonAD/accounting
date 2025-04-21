const { Router } = require("express");
const router = Router();
const { validator } = require("@helper/validator");
const { Controller } = require("./controller");
const {
  createSchema,
  getSchema,
  getByIdSchema,
  deleteSchema,
  updateSchema,
  SmetaGrafikSchema,
} = require("./schema");

router
  .get("/old", validator(Controller.getOld, SmetaGrafikSchema.getOld()))
  .get("/:id", validator(Controller.getById, getByIdSchema))
  .get("/", validator(Controller.get, getSchema))
  .post("/", validator(Controller.create, createSchema))
  .put("/:id", validator(Controller.update, updateSchema))
  .delete("/:id", validator(Controller.deleteSmetGrafik, deleteSchema));

module.exports = router;
