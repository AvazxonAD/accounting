const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')
const {
    bank_prixod,
    select_shartnoma,
    forCreateAndUpdatePage
} = require('../../controller/bank/bank.controller')

router.post('/prixod', protect, bank_prixod)
router.get('/select/shartnoma/:id', protect, select_shartnoma)
router.get('/for/create/and/update/page', protect, forCreateAndUpdatePage)

module.exports = router