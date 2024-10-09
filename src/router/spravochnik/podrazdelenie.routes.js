const { Router } = require("express");
const router = Router();

const upload = require("../../utils/protect.file");

const { protect } = require("../../middleware/auth");
const {
  createPodrazdelenie,
  getPodrazdelenie,
  updatePodrazdelenie,
  deletePodrazdelenie,
  getByIdPodrazdelenie,
} = require("../../controller/spravochnik/podrazdelenie.controller");

router.post("/", protect, createPodrazdelenie);
router.get("/", protect, getPodrazdelenie);
router.put("/:id", protect, updatePodrazdelenie);
router.delete("/:id", protect, deletePodrazdelenie);
router.get("/:id", protect, getByIdPodrazdelenie);

module.exports = router;
