const { Router } = require("express");
const router = Router();
const {
  createBudjet,
  getBudjet,
  updateBudjet,
  deleteBudjet,
  getByIdBudjet,
} = require("../../controller/spravochnik/budjet_name.controller");

router.post("/",  createBudjet);
router.get("/",  getBudjet);
router.put("/:id",  updateBudjet);
router.delete("/:id",  deleteBudjet);
router.get("/:id",  getByIdBudjet);

module.exports = router;
