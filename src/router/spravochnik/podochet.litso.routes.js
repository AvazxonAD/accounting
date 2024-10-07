const { Router } = require("express");
const router = Router();

const upload = require("../../utils/protect.file");

const { protect } = require("../../middleware/auth");
const {
  create,
  getAll,
  update,
  deleteValue,
  importToExcel,
  getElementById,
} = require("../../controller/spravochnik/podotchet_litso.controller");

router.post("/", protect, create);
router.get("/", protect, getAll);
router.put("/:id", protect, update);
router.delete("/:id", protect, deleteValue);
router.get("/:id", protect, getElementById);

module.exports = router;
