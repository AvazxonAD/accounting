const { Router } = require("express");
const router = Router();
const {
  getByIdpodpis,
  createpodpis,
  get,
  deletepodpis,
  updatepodpis,
} = require("./podpis.controller");

router.post("/", createpodpis);
router.get("/", get);
router.put("/:id", updatepodpis);
router.delete("/:id", deletepodpis);
router.get("/:id", getByIdpodpis);

module.exports = router;
