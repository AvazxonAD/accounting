const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const { RegionJur8SchetsSchema } = require("./schema");

const { Router } = require("express");
const router = Router();

router
  .post("/", validator(Controller.create, RegionJur8SchetsSchema.create()))
  .get("/:id", validator(Controller.getById, RegionJur8SchetsSchema.getById()))
  .put("/:id", validator(Controller.update, RegionJur8SchetsSchema.update()))
  .delete("/:id", validator(Controller.delete, RegionJur8SchetsSchema.delete()))
  .get("/", validator(Controller.get, RegionJur8SchetsSchema.get()));

module.exports = router;
