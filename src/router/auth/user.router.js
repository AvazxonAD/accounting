const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");

const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getElementById,
  getRegionAllUsers
} = require("../../controller/auth/user.controller");

router.post("/create", protect, createUser);
router.get("/get/all/", protect, getAllUsers);
router.get("/get/all/:id", protect, getRegionAllUsers);
router.put("/update/:id", protect, updateUser);
router.delete("/delete/:id", protect, deleteUser);
router.get("/get/element/by/:id", protect, getElementById);

module.exports = router;
