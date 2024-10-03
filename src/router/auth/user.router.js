const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");

const {
  createUserForSuperAdmin,
  getAllUsersForSuperAdmin,
  updateUserForSuperAdmin,
  deleteUserForSuperAdmin,
  getElementByIdForSuperAdmin,
  createUserForRegionAdmin,
  getAllUsersForRegionAdmin,
  updateUserForRegionAdmin,
  deleteUserForRegionAdmin,
  getElementByIdForRegionAdmin
} = require("../../controller/auth/user.controller");

router.post("/create/for/super/admin", protect, createUserForSuperAdmin);
router.get("/get/all/for/super/admin", protect, getAllUsersForSuperAdmin);
router.put("/update/for/super/admin/:id", protect, updateUserForSuperAdmin);
router.delete("/delete/for/super/admin/:id", protect, deleteUserForSuperAdmin);
router.get("/get/element/by/for/super/admin/:id", protect, getElementByIdForSuperAdmin);

router.post("/create/for/region/admin", protect, createUserForRegionAdmin);
router.get("/get/all/for/region/admin", protect, getAllUsersForRegionAdmin);
router.put("/update/for/region/admin/:id", protect, updateUserForRegionAdmin);
router.delete("/delete/for/region/admin/:id", protect, deleteUserForRegionAdmin);
router.get("/get/element/by/for/region/admin/:id", protect, getElementByIdForRegionAdmin);



module.exports = router;
