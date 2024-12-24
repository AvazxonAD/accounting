const { EndService } = require('./service');
const { Controller } = require('../../helper/controller');
const {
    createEndSchema,
    getEndSchema,
    updateEndSchema,
    getInfoEndSchema,
    deleteEndSchema,
    getInfoEndAdminSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/admin', Controller(EndService.getEndAdmin));
router.post('/', Controller(EndService.createEnd, createEndSchema));
router.get('/info', Controller(EndService.getInfo, getInfoEndSchema));
router.get('/info/admin', Controller(EndService.getInfoAdmin, getInfoEndAdminSchema));
router.put('/', Controller(EndService.updateEnd, updateEndSchema));
router.delete('/', Controller(EndService.deleteEnd, deleteEndSchema));
router.get('/', Controller(EndService.getEnd, getEndSchema));


module.exports = router;