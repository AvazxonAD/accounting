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
} = require("./schema");

router.get("/:id", validator(Controller.getById, getByIdSchema));
router.get("/", validator(Controller.get, getSchema));
router.post("/", validator(Controller.create, createSchema));
router.put("/:id", validator(Controller.update, updateSchema));
router.delete("/:id", validator(Controller.deleteSmetGrafik, deleteSchema));

module.exports = router;
