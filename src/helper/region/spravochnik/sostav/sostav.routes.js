const { Router } = require("express");
const router = Router();

const { protect } = require("@middleware/auth");
const {
  createSostav,
  getSostav,
  updateSostav,
  deleteSostav,
  getById,
} = require("./sostav.controller");

const { uploadExcel } = require("@utils/protect.file");

router.post("/", createSostav);
router.get("/", getSostav);
router.put("/:id", updateSostav);
router.delete("/:id", deleteSostav);
router.get("/:id", getById);

module.exports = router;
