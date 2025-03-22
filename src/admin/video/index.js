const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const { VideoSchema } = require("./schema");

const { Router } = require("express");
const router = Router();

router
  .post("/", validator(Controller.create, VideoSchema.create()))
  .get("/:id", validator(Controller.getById, VideoSchema.getById()))
  .put("/:id", validator(Controller.update, VideoSchema.update()))
  .delete("/:id", validator(Controller.delete, VideoSchema.delete()))
  .get("/", validator(Controller.get, VideoSchema.get()));

module.exports = router;
