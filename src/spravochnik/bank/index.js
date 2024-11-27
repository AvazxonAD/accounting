const { BankMfoService } = require("./service");
const { Controller } = require('../../helper/controller');
const {
    createBankSchema,
    getBankSchema,
    updateBankSchema,
    getByIdBankSchema,
    deleteBankSchema
} = require("./schema");

const upload = require('../../utils/protect.file')
const { Router } = require('express')
const router = Router()

router.post('/', Controller(BankMfoService.createBankMfo, createBankSchema));
router.get('/:id', Controller(BankMfoService.getByIdBankMfo, getByIdBankSchema));
router.put('/:id', Controller(BankMfoService.updateBankMfo, updateBankSchema));
router.delete('/:id', Controller(BankMfoService.deleteBankMfo, deleteBankSchema));
router.get('/', Controller(BankMfoService.getBankMfo, getBankSchema));
router.post('/import', upload.single('file'), Controller(BankMfoService.importExcelData));


module.exports = router;