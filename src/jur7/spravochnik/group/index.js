const { Controller } = require("./controller");
const { validator } = require('../../../helper/validator');
const upload = require('../../../helper/upload')
const {
    createSchema,
    getSchema,
    updateSchema,
    getByIdGroupSchema,
    deleteSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/percent', Controller.getWithPercent)
router.post('/import', upload.single('file'), validator(Controller.importExcel));
router.post('/', validator(Controller.create, createSchema));
router.get('/:id', validator(Controller.getById, getByIdGroupSchema));
router.put('/:id', validator(Controller.update, updateSchema));
router.delete('/:id', validator(Controller.delete, deleteSchema));
router.get('/', validator(Controller.get, getSchema));


module.exports = router;