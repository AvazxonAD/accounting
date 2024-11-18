const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const { police } = require('../../middleware/police')
const {
  create,
  getAll,
  update,
  deleteValue,
  getElementById
} = require("./schet.operatsii.controller");

router.post("/", protect, police('spravochnik'), create)
  .get("/", protect, police('spravochnik'), getAll)
  .put("/:id", protect, police('spravochnik'), update)
  .delete("/:id", protect, police('spravochnik'), deleteValue)
  .get("/:id", protect, police('spravochnik'), getElementById);

module.exports = router;