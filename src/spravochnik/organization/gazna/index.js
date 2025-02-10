const { Controller } = require('./controller');
const { validator } = require('../../../helper/validator');
const { GaznaSchema } = require("./schema");

const { Router } = require('express');
const router = Router();

const upload = require('../../../helper/upload');

router
    .post('/', validator(Controller.create, GaznaSchema.create()))
    .post('/import', upload.single('file'), validator(Controller.import, GaznaSchema.import()))
    .get('/template', validator(Controller.template))
    .get('/:id', validator(Controller.getById, GaznaSchema.getById()))
    .put('/:id', validator(Controller.update, GaznaSchema.update()))
    .delete('/:id', validator(Controller.delete, GaznaSchema.delette()))
    .get('/', validator(Controller.get, GaznaSchema.get()));


module.exports = router;