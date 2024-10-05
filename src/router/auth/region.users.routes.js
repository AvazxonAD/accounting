const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");

const {
  createUserForRegionAdmin,
  getAllUsersForRegionAdmin,
  updateUserForRegionAdmin,
  deleteUserForRegionAdmin,
  getElementByIdForRegionAdmin
} = require("../../controller/auth/region.users.controller");

router.post("/", protect, createUserForRegionAdmin)
  .get("/:id", protect, getElementByIdForRegionAdmin)
  .get("/", protect, getAllUsersForRegionAdmin)
  .put("/", protect, updateUserForRegionAdmin)
  .delete("/", protect, deleteUserForRegionAdmin);



module.exports = router;
