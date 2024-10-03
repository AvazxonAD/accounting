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

router.post("/create", protect, createUserForRegionAdmin);
router.get("/get/all", protect, getAllUsersForRegionAdmin);
router.put("/update/:id", protect, updateUserForRegionAdmin);
router.delete("/delete/:id", protect, deleteUserForRegionAdmin);
router.get("/get/element/by/:id", protect, getElementByIdForRegionAdmin);



module.exports = router;
