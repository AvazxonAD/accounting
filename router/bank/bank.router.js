const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')
const {
    bank_prixod,
    select_shartnoma,
    bank_prixod_update,
    getAllBankPrixod,
    delete_bank_prixod,
    bank_rasxod,
    bank_rasxod_update,
    getAllBankRasxod,
    delete_bank_rasxod,
    getElementByIdBankPrixod,
    getElementByIdBankRasxod
} = require('../../controller/bank/bank.controller')

router.post('/prixod', protect, bank_prixod)
router.get('/select/shartnoma/:id', protect, select_shartnoma)
router.put('/prixod/update/:id', protect, bank_prixod_update)
router.get('/get/all/prixod', protect, getAllBankPrixod)
router.delete('/delete/bank/prixod/:id', protect, delete_bank_prixod)
router.get('/get/element/prixod/by/:id', protect, getElementByIdBankPrixod)


router.post('/rasxod', protect, bank_rasxod)
router.put('/rasxod/update/:id', protect, bank_rasxod_update)
router.get('/get/all/rasxod', protect, getAllBankRasxod)
router.delete('/delete/bank/rasxod/:id', protect, delete_bank_rasxod)
router.get('/get/element/rasxod/by/:id', protect, getElementByIdBankRasxod)


module.exports = router