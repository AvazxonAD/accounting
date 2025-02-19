const { Controller } = require('./controller');
const { validator } = require('@helper/validator');
const upload = require('@helper/upload');
const { PrixodSchema } = require("./schema");

const { Router } = require('express')
const router = Router()

router
    .get('/report', validator(Controller.getPrixodReport, PrixodSchema.report()))
    .post('/', validator(Controller.create, PrixodSchema.create()))
    .get('/:id', validator(Controller.getById, PrixodSchema.getById()))
    .put('/:id', validator(Controller.update, PrixodSchema.update()))
    .delete('/:id', validator(Controller.delete, PrixodSchema.delete()))
    .get('/', validator(Controller.get, PrixodSchema.get()));
    
    // .post('/import', upload.single('file'), validator(Controller.importData, PrixodSchema.importSchema2()))
    // .get('/template', validator(Controller.templateFile))

module.exports = router;