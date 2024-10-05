const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
    createController
} = require("../../controller/show.services/show.services.controller");

router.post("/", protect, createController);

module.exports = router;
