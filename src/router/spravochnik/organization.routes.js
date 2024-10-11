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

router.post("/", createOrganization);
router.get("/", getOrganization);
router.put("/:id", updateOrganization);
router.delete("/:id", deleteOrganization);
router.get("/:id", getByIdOrganization);

module.exports = router;
