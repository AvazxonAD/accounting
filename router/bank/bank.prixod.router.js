const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')
const {
    bank_prixod,
    bank_prixod_update,
    getAllBankPrixod,
    delete_bank_prixod,
    getElementByIdBankPrixod,
} = require('../../controller/bank/bank.prixod.controller')

router.post('/create', protect, bank_prixod)
router.put('/update/:id', protect, bank_prixod_update)
router.get('/get/all', protect, getAllBankPrixod)
router.delete('/delete/:id', protect, delete_bank_prixod)
router.get('/get/element/by/:id', protect, getElementByIdBankPrixod)

module.exports = router