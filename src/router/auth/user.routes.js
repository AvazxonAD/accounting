const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");

const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getByIdUser
} = require("../../controller/auth/user.controller");

router.post("/", protect, createUser)
  .get("/:id", protect, getByIdUser)
  .get("/", protect, getUser)
  .put("/:id", protect, updateUser)
  .delete("/:id", protect, deleteUser);



module.exports = router;
