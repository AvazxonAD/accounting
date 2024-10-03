const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");

const {
  createUserForSuperAdmin,
  getAllUsersForSuperAdmin,
  updateUserForSuperAdmin,
  deleteUserForSuperAdmin,
  getElementByIdForSuperAdmin,
  getRegionAllUsers,
} = require("../../controller/auth/user.controller");

router.post("/create/for/super/admin", protect, createUserForSuperAdmin);
router.get("/get/all/for/super/admin", protect, getAllUsersForSuperAdmin);
router.put("/update/for/super/admin/:id", protect, updateUserForSuperAdmin);
router.delete("/delete/for/super/admin/:id", protect, deleteUserForSuperAdmin);
router.get("/get/element/by/for/super/admin/:id", protect, getElementByIdForSuperAdmin);

router.get("/get/all/:id", protect, getRegionAllUsers);


module.exports = router;
