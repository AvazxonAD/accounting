const { Router } = require('express');
const router = Router();
const { Controller } = require('../../helper/controller')
const { SmetaService } = require('./service')
const {
    createSchema,
    getSchema,
    getByIdSchema,
    deleteSchema,
    updateSchema
} = require('./schema')


router.get("/:id", Controller(SmetaService.getByIdSmeta, getByIdSchema));
router.get("/", Controller(SmetaService.getSmeta, getSchema));
router.post("/", Controller(SmetaService.createSmeta, createSchema));
router.put("/:id", Controller(SmetaService.updateSmeta, updateSchema));
router.delete("/:id", Controller(SmetaService.deleteSmeta, deleteSchema));

module.exports = router;
