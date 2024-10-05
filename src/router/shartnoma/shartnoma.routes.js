const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  create,
  getAll,
  getElementById,
  update_shartnoma,
  getByIdOrganization_Shartnoma,
  deleteShartnoma,
} = require("../../controller/shartnoma/shartnoma.controller");

router.post("/create", protect, create);
router.get("/", protect, getAll);
router.get("/get/element/by/:id", protect, getElementById);
router.put("/update/:id", protect, update_shartnoma);
router.get("/get/by/organization/id/:id", protect, getByIdOrganization_Shartnoma);
router.delete("/delete/:id", protect, deleteShartnoma);

module.exports = router;
