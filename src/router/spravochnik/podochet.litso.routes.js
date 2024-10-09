const { Router } = require("express");
const router = Router();

const upload = require("../../utils/protect.file");

const { protect } = require("../../middleware/auth");
const {
  createPodotchetLitso,
  getPodotchetLitso,
  updatePodotchetLitso,
  deletePodotchetLitso,
  getByIdPodotchetLitso,
} = require("../../controller/spravochnik/podotchet_litso.controller");

router.post("/", protect, createPodotchetLitso);
router.get("/", protect, getPodotchetLitso);
router.put("/:id", protect, updatePodotchetLitso);
router.delete("/:id", protect, deletePodotchetLitso);
router.get("/:id", protect, getByIdPodotchetLitso);

module.exports = router;
