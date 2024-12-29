const { Router } = require('express');
const router = Router();
const { validator } = require('../../helper/validator')
const { SmetaGrafikService } = require('./service')
const {
    createSchema,
    getSchema,
    getByIdSchema,
    deleteSchema,
    updateSchema
} = require('./schema')


router.get("/:id", validator(SmetaGrafikService.getByIdSmetaGrafik, getByIdSchema));
router.get("/", validator(SmetaGrafikService.getSmetaGrafik, getSchema));
router.post("/", validator(SmetaGrafikService.createSmetaGrafik, createSchema));
router.put("/:id", validator(SmetaGrafikService.updateSmetaGrafik, updateSchema));
router.delete("/:id", validator(SmetaGrafikService.deleteSmetGrafik, deleteSchema));

module.exports = router;
