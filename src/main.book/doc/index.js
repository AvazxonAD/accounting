const { DocService } = require('./service');
const { Controller } = require('../../helper/controller');
const {
    createDocSchema,
    getDocSchema,
    updateDocSchema,
    getByIdDocSchema,
    deleteDocSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', Controller(DocService.createDoc, createDocSchema));
router.get('/:id', Controller(DocService.getByIdDoc, getByIdDocSchema));
router.put('/', Controller(DocService.updateDoc, updateDocSchema));
router.delete('/:id', Controller(DocService.deleteDoc, deleteDocSchema));
router.get('/', Controller(DocService.getDoc, getDocSchema));


module.exports = router;