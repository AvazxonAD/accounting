const { DocService } = require('./service');
const { validator } = require('../../helper/validator');
const {
    createDocSchema,
    getDocSchema,
    updateDocSchema,
    getByIdDocSchema,
    deleteDocSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(DocService.createDoc, createDocSchema))
    .get('/operatsii', validator(DocService.getOperatsiiMainBook))
    .get('/:id', validator(DocService.getByIdDoc, getByIdDocSchema))
    .put('/:id', validator(DocService.updateDoc, updateDocSchema))
    .delete('/:id', validator(DocService.deleteDoc, deleteDocSchema))
    .get('/', validator(DocService.getDoc, getDocSchema));


module.exports = router;