const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  createSostav,
  getSostav,
  updateSostav,
  deleteSostav,
  getByIdSostav,
} = require("../../controller/spravochnik/sostav.controller");

const upload = require("../../utils/protect.file");

router.post("/", protect, createSostav);
router.get("/", protect, getSostav);
router.put("/:id", protect, updateSostav);
router.delete("/:id", protect, deleteSostav);
router.get("/:id", protect, getByIdSostav);

module.exports = router;
