const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const { WorkerTripSchema } = require("./schema");

const { Router } = require("express");
const router = Router();

router.post("/", validator(Controller.create, WorkerTripSchema.create()));
router.get("/:id", validator(Controller.getById, WorkerTripSchema.getById()));
router.put("/:id", validator(Controller.update, WorkerTripSchema.update()));
router.delete("/:id", validator(Controller.delete, WorkerTripSchema.delete()));
router.get("/", validator(Controller.get, WorkerTripSchema.get()));

module.exports = router;
