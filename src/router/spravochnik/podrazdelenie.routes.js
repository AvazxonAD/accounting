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

router.post("/", createPodrazdelenie);
router.get("/", getPodrazdelenie);
router.put("/:id", updatePodrazdelenie);
router.delete("/:id", deletePodrazdelenie);
router.get("/:id", getByIdPodrazdelenie);

module.exports = router;
