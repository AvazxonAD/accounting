const { Router } = require('express');
const router = Router();
const { validator } = require('../../helper/validator')
const { SmetaService } = require('./service')
const upload = require('../../helper/upload.js')
const {
    createSchema,
    getSchema,
    getByIdSchema,
    deleteSchema,
    updateSchema
} = require('./schema')


router.get("/:id", validator(SmetaService.getByIdSmeta, getByIdSchema));
router.get("/", validator(SmetaService.getSmeta, getSchema));
router.post("/import", upload.single('file'), validator(SmetaService.importSmetaData));
router.post("/", validator(SmetaService.createSmeta, createSchema));
router.put("/:id", validator(SmetaService.updateSmeta, updateSchema));
router.delete("/:id", validator(SmetaService.deleteSmeta, deleteSchema));

module.exports = router;
