const { Controller } = require('./controller');
const { validator } = require('@helper/validator');
const upload = require('@helper/upload');
const { PrixodJur7Schema } = require("./schema");

const { Router } = require('express')
const router = Router()

router
    .get('/docs/:id', validator(Controller.rasxodDocs, PrixodJur7Schema.rasxodDocs()))
    .get('/report', validator(Controller.getPrixodReport, PrixodJur7Schema.report()))
    .get('/template', validator(Controller.templateImport))
    .post('/', validator(Controller.create, PrixodJur7Schema.create()))
    .post('/read', upload.single('file'), validator(Controller.readFile, PrixodJur7Schema.readFile()))
    .get('/:id', validator(Controller.getById, PrixodJur7Schema.getById()))
    .put('/:id', validator(Controller.update, PrixodJur7Schema.update()))
    .delete('/:id', validator(Controller.delete, PrixodJur7Schema.delete()))
    .get('/', validator(Controller.get, PrixodJur7Schema.get()));

module.exports = router;