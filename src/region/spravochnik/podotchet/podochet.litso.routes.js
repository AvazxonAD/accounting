const { Router } = require("express");
const router = Router();

const { uploadExcel } = require("@utils/protect.file");

const {
  createPodotchetLitso,
  getPodotchetLitso,
  updatePodotchetLitso,
  deletePodotchetLitso,
  getByIdPodotchetLitso,
} = require("./podotchet_litso.controller");

router.post("/", createPodotchetLitso);
router.get("/", getPodotchetLitso);
router.put("/:id", updatePodotchetLitso);
router.delete("/:id", deletePodotchetLitso);
router.get("/:id", getByIdPodotchetLitso);

module.exports = router;
