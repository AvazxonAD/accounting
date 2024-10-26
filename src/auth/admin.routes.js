const { Router } = require("express");
const router = Router();

const { protect } = require("../middleware/auth");

const {
  createAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  getByIdAdmin,
} = require("./admin.conntroller");

router.post("/", createAdmin)
  .get("/", getAdmin)
  .put("/:id", updateAdmin)
  .delete("/:id", deleteAdmin)
  .get("/:id", getByIdAdmin);

module.exports = router;
