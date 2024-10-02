const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");

const {
  createUserForSuperAdmin,
  getAllUsersForSuperAdmin,
  updateUser,
  deleteUser,
  getElementById,
  getRegionAllUsers,
} = require("../../controller/auth/user.controller");

router.post("/create/for/super/admin", protect, createUserForSuperAdmin);
router.get("/get/all/for/super", protect, getAllUsersForSuperAdmin);
router.get("/get/all/:id", protect, getRegionAllUsers);
router.put("/update/:id", protect, updateUser);
router.delete("/delete/:id", protect, deleteUser);
router.get("/get/element/by/:id", protect, getElementById);

module.exports = router;
