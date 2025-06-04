const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const { createSchema, getUnitSchema, updateUnitSchema, getByIdSchema, deleteUnitSchema } = require("./schema");

const { Router } = require("express");
const router = Router();

router.post("/", validator(Controller.create, createSchema));
router.get("/:id", validator(Controller.getById, getByIdSchema));
router.put("/:id", validator(Controller.updateUnit, updateUnitSchema));
router.delete("/:id", validator(Controller.deleteUnit, deleteUnitSchema));
router.get("/", validator(Controller.getUnit, getUnitSchema));

module.exports = router;
