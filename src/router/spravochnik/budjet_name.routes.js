const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  createBudjet,
  getBudjet,
  updateBudjet,
  deleteBudjet,
  getByIdBudjet,
} = require("../../controller/spravochnik/budjet_name.controller");

router.post("/", protect, createBudjet);
router.get("/", getBudjet);
router.put("/:id", protect, updateBudjet);
router.delete("/:id", protect, deleteBudjet);
router.get("/:id", protect, getByIdBudjet);

module.exports = router;
