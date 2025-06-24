const { Router } = require("express");
const router = Router();

const { uploadExcel } = require("@helper/upload");

const { protect } = require("@middleware/auth");
const {
  createPodrazdelenie,
  get,
  updatePodrazdelenie,
  deletePodrazdelenie,
  getByIdPodrazdelenie,
} = require("./podrazdelenie.controller");

router.post("/", createPodrazdelenie);
router.get("/", get);
router.put("/:id", updatePodrazdelenie);
router.delete("/:id", deletePodrazdelenie);
router.get("/:id", getByIdPodrazdelenie);

module.exports = router;
