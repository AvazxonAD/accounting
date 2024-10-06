const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");

const {
  createAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  getByIdAdmin,
} = require("../../controller/auth/admin.conntroller");

router.post("/", protect, createAdmin)
  .get("/", protect, getAdmin)
  .put("/:id", protect, updateAdmin)
  .delete("/:id", protect, deleteAdmin)
  .get("/:id", protect, getByIdAdmin);

module.exports = router;
