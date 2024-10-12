const { Router } = require("express");
const router = Router();
const { police } = require('../../middleware/police')
const { protect } = require("../../middleware/auth");
const {
  create,
  getAll,
  update,
  deleteValue,
  getElementById,
} = require("../../controller/smeta/smeta.controller");

router.post("/", protect, police('smeta'), create);
router.get("/", protect, police('smeta_get'), getAll);
router.put("/:id", protect, police('smeta'), update);
router.delete("/:id", protect, police('smeta'), deleteValue);
router.get("/:id", protect, police('smeta_get'), getElementById);

module.exports = router;
