const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')
const {
    bank_prixod,
    select_shartnoma
} = require('../../controller/bank/bank.controller')

router.post('/prixod', protect, bank_prixod)
router.get('/select/shartnoma/:id', protect, select_shartnoma)

module.exports = router