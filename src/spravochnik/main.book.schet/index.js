const { MainBookSchetService } = require("./service");
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

router.post('/', validator(MainBookSchetService.createMainBookSchet, createMainBookSchetSchema))
    .get('/:id', validator(MainBookSchetService.getByIdMainBookSchet, getByIdMainBookSchetSchema))
    .post('/import', upload.single('file'), validator(MainBookSchetService.importSmetaData))
    .put('/:id', validator(MainBookSchetService.updateMainBookSchet, updateMainBookSchetSchema))
    .delete('/:id', validator(MainBookSchetService.deleteMainBookSchet, deleteMainBookSchetSchema))
    .get('/', validator(MainBookSchetService.getMainBookSchet, getMainBookSchetSchema));


module.exports = router;