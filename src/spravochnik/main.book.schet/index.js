const { MainBookSchetService } = require("./service");
const { Controller } = require('../../helper/controller');
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

router.post('/', Controller(MainBookSchetService.createMainBookSchet, createMainBookSchetSchema))
    .get('/:id', Controller(MainBookSchetService.getByIdMainBookSchet, getByIdMainBookSchetSchema))
    .post('/import', upload.single('file'), Controller(MainBookSchetService.importSmetaData))
    .put('/:id', Controller(MainBookSchetService.updateMainBookSchet, updateMainBookSchetSchema))
    .delete('/:id', Controller(MainBookSchetService.deleteMainBookSchet, deleteMainBookSchetSchema))
    .get('/', Controller(MainBookSchetService.getMainBookSchet, getMainBookSchetSchema));


module.exports = router;