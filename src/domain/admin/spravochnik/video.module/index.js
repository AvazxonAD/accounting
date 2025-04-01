const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const { VideoModuleSchema } = require("./schema");

const { Router } = require("express");
const router = Router();

router
  .post("/", validator(Controller.create, VideoModuleSchema.create()))
  .get("/:id", validator(Controller.getById, VideoModuleSchema.getById()))
  .put("/:id", validator(Controller.update, VideoModuleSchema.update()))
  .delete("/:id", validator(Controller.delete, VideoModuleSchema.delete()))
  .get("/", validator(Controller.get, VideoModuleSchema.get()));

module.exports = router;
