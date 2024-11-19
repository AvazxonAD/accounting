const { Router } = require("express");
const router = Router();
const {
  create,
  getAll,
  update,
  deleteValue,
  getElementById,
  importExcelData
} = require("./smeta.controller");
const upload = require('../utils/protect.file')

router.post("/import", upload.single('file'), importExcelData);
router.post("/",  create);
router.get("/",  getAll);
router.put("/:id", update);
router.delete("/:id", deleteValue);
router.get("/:id", getElementById);

module.exports = router;
