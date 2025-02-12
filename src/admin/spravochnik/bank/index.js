const { Controller } = require("./controller");
const { validator } = require('@helper/validator');
const {
    createBankSchema,
    getBankSchema,
    updateBankSchema,
    getByIdBankSchema,
    deleteBankSchema
} = require("./schema");

const upload = require('@utils/protect.file')
const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.create, createBankSchema));
router.get('/:id', validator(Controller.getByIdBankMfo, getByIdBankSchema));
router.put('/:id', validator(Controller.updateBankMfo, updateBankSchema));
router.delete('/:id', validator(Controller.deleteBankMfo, deleteBankSchema));
router.get('/', validator(Controller.getBankMfo, getBankSchema));
router.post('/import', upload.single('file'), validator(Controller.importExcelData));


module.exports = router;