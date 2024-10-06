const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  createRole,
  getAllRole,
  updateRole,
  deleteRole,
  getByIdRole,
} = require("../../controller/auth/role.controller");

router.post("/", protect, createRole)
  .get("/", protect, getAllRole)
  .put("/:id", protect, updateRole)
  .delete("/:id", protect, deleteRole)
  .get("/:id", protect, getByIdRole);

module.exports = router;
