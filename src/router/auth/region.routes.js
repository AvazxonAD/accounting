const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  createRegion,
  getAllReegion,
  updateRegion,
  deleteRegion,
  getElementById,
} = require("../../controller/auth/region.ccontroller");

router.post("/", protect, createRegion)
  .get("/", protect, getAllReegion)
  .put("/:id", protect, updateRegion)
  .delete("/:id", protect, deleteRegion)
  .get("/:id", protect, getElementById);

module.exports = router;
