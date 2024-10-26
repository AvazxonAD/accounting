const { Router } = require("express");
const router = Router();

const { protect } = require("../middleware/auth");
const {
  createRegion,
  getAllReegion,
  updateRegion,
  deleteRegion,
  getElementById,
} = require("./region.ccontroller");

router.post("/", createRegion)
  .get("/", getAllReegion)
  .put("/:id", updateRegion)
  .delete("/:id", deleteRegion)
  .get("/:id", getElementById);

module.exports = router;
