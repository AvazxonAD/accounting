const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  createOrganization,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  getByIdOrganization,
} = require("../../controller/spravochnik/organization.controller");

const upload = require("../../utils/protect.file");

router.post("/", protect, createOrganization);
router.get("/", protect, getOrganization);
router.put("/:id", protect, updateOrganization);
router.delete("/:id", protect, deleteOrganization);
router.get("/:id", protect, getByIdOrganization);

module.exports = router;
