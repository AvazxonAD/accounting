const { EndService } = require('./service');
const { Controller } = require('../../helper/controller');
const {
    createEndSchema,
    getEndSchema,
    updateEndSchema,
    getByIdEndSchema,
    deleteEndSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', Controller(EndService.createEnd, createEndSchema));
router.get('/id', Controller(EndService.getByIdEnd, getByIdEndSchema));
router.get('/info', Controller(EndService.getInfo, getByIdEndSchema));
router.put('/', Controller(EndService.updateEnd, updateEndSchema));
router.delete('/', Controller(EndService.deleteEnd, deleteEndSchema));
router.get('/', Controller(EndService.getEnd, getEndSchema));


module.exports = router;