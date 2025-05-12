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
  .get(
    "/order-number",
    validator(Controller.getByOrderNumber, SmetaGrafikSchema.getByOrderNumber())
  )
  .get("/:id", validator(Controller.getById, getByIdSchema))
  .get("/", validator(Controller.get, getSchema))
  .post("/", validator(Controller.create, SmetaGrafikSchema.create()))
  .put("/:id", validator(Controller.update, SmetaGrafikSchema.update()))
  .delete("/:id", validator(Controller.deleteSmetGrafik, deleteSchema));

module.exports = router;
