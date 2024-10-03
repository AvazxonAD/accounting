const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");

const {
  createUserForSuperAdmin,
  getAllUsersForSuperAdmin,
  updateUserForSuperAdmin,
  deleteUserForSuperAdmin,
  getElementByIdForSuperAdmin,
} = require("../../controller/auth/super.admin.users");

router.post("/create", protect, createUserForSuperAdmin);
router.get("/get/all", protect, getAllUsersForSuperAdmin);
router.put("/update/:id", protect, updateUserForSuperAdmin);
router.delete("/delete/:id", protect, deleteUserForSuperAdmin);
router.get("/get/element/by/:id", protect, getElementByIdForSuperAdmin);

module.exports = router;
