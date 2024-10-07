const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  create,
  getAll,
  getElementById,
  update_shartnoma,
  deleteShartnoma,
} = require("../../controller/shartnoma/shartnoma.controller");

router.post("/", protect, create);
router.get("/", protect, getAll);
router.get("/:id", protect, getElementById);
router.put("/:id", protect, update_shartnoma);
router.delete("/:id", protect, deleteShartnoma);

module.exports = router;
