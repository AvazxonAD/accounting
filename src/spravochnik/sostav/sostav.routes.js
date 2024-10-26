const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  createSostav,
  getSostav,
  updateSostav,
  deleteSostav,
  getByIdSostav,
} = require("./sostav.controller");

const upload = require("../../utils/protect.file");

router.post("/", createSostav);
router.get("/", getSostav);
router.put("/:id", updateSostav);
router.delete("/:id", deleteSostav);
router.get("/:id", getByIdSostav);

module.exports = router;
