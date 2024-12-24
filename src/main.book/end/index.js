const { EndService } = require('./service');
const { Controller } = require('../../helper/controller');
const {
    createEndSchema,
    getEndSchema,
    updateEndSchema,
    getInfoEndSchema,
    deleteEndSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', Controller(EndService.createEnd, createEndSchema));
router.get('/info', Controller(EndService.getInfo, getInfoEndSchema));
router.put('/', Controller(EndService.updateEnd, updateEndSchema));
router.delete('/', Controller(EndService.deleteEnd, deleteEndSchema));
router.get('/', Controller(EndService.getEnd, getEndSchema));


module.exports = router;