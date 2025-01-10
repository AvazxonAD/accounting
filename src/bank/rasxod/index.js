const { Controller } = require('./controller');
const { validator } = require('../../helper/validator');
const {
    createSchema,
    updateSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.createBankRasxod, createSchema))
    .get('/id', validator(Controller.getByIdDoc, getByIdDocSchema))
    .put('/', validator(Controller.updateDoc, updateDocSchema))
    .delete('/', validator(Controller.deleteDoc, deleteDocSchema))
    .get('/', validator(Controller.getDoc, getDocSchema));


module.exports = router;