const { Router } = require("express");
const router = Router();
const {
  createBudjet,
  getBudjet,
  updateBudjet,
  deleteBudjet,
  getById,
} = require("./budjet_name.controller");

router.post("/",  createBudjet);
router.get("/",  getBudjet);
router.put("/:id",  updateBudjet);
router.delete("/:id",  deleteBudjet);
router.get("/:id",  getById);

module.exports = router;
