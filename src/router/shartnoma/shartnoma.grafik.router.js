const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
    getAllGrafik
} = require("../../controller/shartnoma/shartnoma.grafik.controller");

router.get('/get/all', protect, getAllGrafik)

module.exports = router;
