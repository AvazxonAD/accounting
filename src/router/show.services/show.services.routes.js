const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
    createController,
    getShowService
} = require("../../controller/show.services/show.services.controller");

router.post("/", protect, createController);
router.get('/', protect, getShowService)

module.exports = router;
