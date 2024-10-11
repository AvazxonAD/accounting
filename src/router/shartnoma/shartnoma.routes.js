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

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getElementById);
router.put("/:id", update_shartnoma);
router.delete("/:id", deleteShartnoma);

module.exports = router;
