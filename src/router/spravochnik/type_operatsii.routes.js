const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  createTypeOperatsii,
  getTypeOperatsii,
  updateTypeOperatsii,
  deleteTypeOperatsii,
  getByIdTypeOperatsii,
} = require("../../controller/spravochnik/type_operatsii.controller");

const upload = require("../../utils/protect.file");

router.post("/", createTypeOperatsii);
router.get("/", getTypeOperatsii);
router.put("/:id", updateTypeOperatsii);
router.delete("/:id", deleteTypeOperatsii);
router.get("/:id", getByIdTypeOperatsii);

module.exports = router;
