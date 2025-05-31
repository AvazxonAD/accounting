const { Controller } = require("./controller");
const { createSchema, getByIdSchema, updateSchema, deleteSchema, RegionSchema } = require("./schema");

const { Router } = require("express");
const router = Router();
const { validator } = require("@helper/validator");

router
  .post("/", validator(Controller.createRegion, createSchema))
  .get("/", validator(Controller.get, RegionSchema.get()))
  .get("/:id", validator(Controller.getById, getByIdSchema))
  .delete("/:id", validator(Controller.deleteRegion, deleteSchema))
  .put("/:id", validator(Controller.updateRegion, updateSchema));

module.exports = router;
