const { Router } = require("express");
const router = Router();
const { validator } = require("@helper/validator");
const { Controller } = require("./controller");
const { uploadExcel } = require("@helper/upload.js");
const {
  createSchema,
  getSchema,
  getByIdSchema,
  deleteSchema,
  updateSchema,
} = require("./schema");

router.get("/:id", validator(Controller.getById, getByIdSchema));
router.get("/", validator(Controller.getSmeta, getSchema));
router.post(
  "/import",
  uploadExcel.single("file"),
  validator(Controller.importSmetaData)
);
router.post("/", validator(Controller.createSmeta, createSchema));
router.put("/:id", validator(Controller.updateSmeta, updateSchema));
router.delete("/:id", validator(Controller.deleteSmeta, deleteSchema));

module.exports = router;
