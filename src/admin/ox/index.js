const { Controller } = require('./controllers');
const { validator } = require('../../helper/validator');
const {
    createSchema,
    getSchema,
    updateSchema,
    getByIdSchema,
    deleteSchema,
    sendSchema
} = require("./schemas");

const { Router } = require('express')
const router = Router()

router.get('/:id', validator(Controller.getByIdDoc, getByIdSchema))
    .put('/confirm/:id', validator(Controller.confirmDoc, sendSchema))
    .get('/', Controller.getDoc);


module.exports = router;