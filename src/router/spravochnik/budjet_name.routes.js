const { Router } = require("express");
const router = Router();
const { police } = require('../../middleware/police')
const { protect } = require("../../middleware/auth");
const {
  createBudjet,
  getBudjet,
  updateBudjet,
  deleteBudjet,
  getByIdBudjet,
} = require("../../controller/spravochnik/budjet_name.controller");

router.post("/", protect, police('budjet'), createBudjet);
router.get("/", protect, police('budjet_get'), getBudjet);
router.put("/:id", protect, police('budjet'), updateBudjet);
router.delete("/:id", protect, police('budjet'), deleteBudjet);
router.get("/:id", protect, police('budjet_get'), getByIdBudjet);

module.exports = router;
