const { Controller } = require("./controller");
const { validator } = require('../../helper/validator');
const {
    createMainBookSchetSchema,
    getMainBookSchetSchema,
    updateMainBookSchetSchema,
    getByIdMainBookSchetSchema,
    deleteMainBookSchetSchema
} = require("./schema");
const upload = require('../../helper/upload')
const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.createMainBookSchet, createMainBookSchetSchema))
    .get('/:id', validator(Controller.getByIdMainBookSchet, getByIdMainBookSchetSchema))
    .post('/import', upload.single('file'), validator(Controller.importSmetaData))
    .put('/:id', validator(Controller.updateMainBookSchet, updateMainBookSchetSchema))
    .delete('/:id', validator(Controller.deleteMainBookSchet, deleteMainBookSchetSchema))
    .get('/', validator(Controller.getMainBookSchet, getMainBookSchetSchema));


module.exports = router;