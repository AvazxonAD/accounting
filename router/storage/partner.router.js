const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')

const {
    create_partner,
    get_all_partner,
    update_partner,
    delete_partner,
    search_partner_by_inn
} = require('../../controller/storage/partner.controller')

router.post('/partner/create', protect, create_partner)
router.get('/partner/get/all', protect, get_all_partner)
router.put('/partner/update/:id', protect, update_partner)
router.delete('/partner/delete/:id', protect, delete_partner)
router.post('/partner/search/by/inn', protect, search_partner_by_inn)


module.exports = router