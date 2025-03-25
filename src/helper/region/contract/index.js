const { Router } = require("express");
const router = Router();

const { Controller, } = require("@contract/controller");
const { validator } = require('@helper/validator');
const { ContractSchema } = require('@contract/schema');

router
  .post("/", validator(Controller.create, ContractSchema.create()))
  .get("/", validator(Controller.get, ContractSchema.get()))
  .get("/:id", validator(Controller.getById, ContractSchema.getById()))
  .put("/:id", validator(Controller.update, ContractSchema.update()))
  .delete("/:id", validator(Controller.delete, ContractSchema.delete()));

module.exports = router;
