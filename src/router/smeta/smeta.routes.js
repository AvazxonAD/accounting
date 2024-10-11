const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  create,
  getAll,
  update,
  deleteValue,
  getElementById,
} = require("../../controller/smeta/smeta.controller");

router.post("/", create);
router.get("/", getAll);
router.put("/:id", update);
router.delete("/:id", deleteValue);
router.get("/:id", getElementById);

module.exports = router;
