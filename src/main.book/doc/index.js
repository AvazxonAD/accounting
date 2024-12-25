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

router.post('/', Controller(DocService.createDoc, createDocSchema))
    .get('/operatsii', Controller(DocService.getOperatsiiMainBook))
    .get('/:id', Controller(DocService.getByIdDoc, getByIdDocSchema))
    .put('/:id', Controller(DocService.updateDoc, updateDocSchema))
    .delete('/:id', Controller(DocService.deleteDoc, deleteDocSchema))
    .get('/', Controller(DocService.getDoc, getDocSchema));


module.exports = router;