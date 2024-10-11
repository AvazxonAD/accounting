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

router.post("/", createRole)
  .get("/", getAllRole)
  .put("/:id", updateRole)
  .delete("/:id", deleteRole)
  .get("/:id", getByIdRole);

module.exports = router;
