const { Router } = require("express");
const router = Router();
const {
  getByIdpodpis,
  createpodpis,
  getpodpis,
  deletepodpis,
  updatepodpis
} = require("./podpis.controller");

router.post("/",  createpodpis);
router.get("/",  getpodpis);
router.put("/:id",  updatepodpis);
router.delete("/:id",  deletepodpis);
router.get("/:id",  getByIdpodpis);

module.exports = router;
