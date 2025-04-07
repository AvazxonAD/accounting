const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const {
  createSchema,
  getSchema,
  updateSchema,
  getByIdSchema,
  deleteSchema,
} = require("./schema");

const { Router } = require("express");
const router = Router();

router.post("/", validator(Controller.create, createSchema));
router.get("/:id", validator(Controller.getById, getByIdSchema));
router.put("/:id", validator(Controller.update, updateSchema));
router.delete("/:id", validator(Controller.delete, deleteSchema));
router.get("/", validator(Controller.get, getSchema));

module.exports = router;
