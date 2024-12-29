const { BankMfoService } = require("./service");
const { validator } = require('../../helper/validator');
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

router.post('/', validator(BankMfoService.createBankMfo, createBankSchema));
router.get('/:id', validator(BankMfoService.getByIdBankMfo, getByIdBankSchema));
router.put('/:id', validator(BankMfoService.updateBankMfo, updateBankSchema));
router.delete('/:id', validator(BankMfoService.deleteBankMfo, deleteBankSchema));
router.get('/', validator(BankMfoService.getBankMfo, getBankSchema));
router.post('/import', upload.single('file'), validator(BankMfoService.importExcelData));


module.exports = router;