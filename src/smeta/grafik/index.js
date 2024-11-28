const { Router } = require('express');
const router = Router();
const { Controller } = require('../../helper/controller')
const { SmetaGrafikService } = require('./service')
const {
    createSchema,
    getSchema,
    getByIdSchema,
    deleteSchema,
    updateSchema
} = require('./schema')


router.get("/:id", Controller(SmetaGrafikService.getByIdSmetaGrafik, getByIdSchema));
router.get("/", Controller(SmetaGrafikService.getSmetaGrafik, getSchema));
router.post("/", Controller(SmetaGrafikService.createSmetaGrafik, createSchema));
router.put("/:id", Controller(SmetaGrafikService.updateSmetaGrafik, updateSchema));
router.delete("/:id", Controller(SmetaGrafikService.deleteSmetGrafik, deleteSchema));

module.exports = router;
