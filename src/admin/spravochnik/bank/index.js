const { Controller } = require("./controller");
const { validator } = require('@helper/validator');
const {
    createBankSchema,
    getBankSchema,
    updateBankSchema,
    getByIdBankSchema,
    deleteBankSchema,
    BankSchema
} = require("./schema");

const upload = require('@utils/protect.file')
const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.create, createBankSchema))
    .get('/mfo/:mfo', validator(Controller.getByMfo, BankSchema.getByMfo()))
    .get('/:id', validator(Controller.getByIdBankMfo, getByIdBankSchema))
    .put('/:id', validator(Controller.updateBankMfo, updateBankSchema))
    .delete('/:id', validator(Controller.deleteBankMfo, deleteBankSchema))
    .get('/', validator(Controller.getBankMfo, getBankSchema))
    .post('/import', upload.single('file'), validator(Controller.importExcelData));


module.exports = router;