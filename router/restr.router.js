const {Router} = require('express') 
const router = Router()

const { protect } = require('../middleware/auth')

const {
    for_revenue_restr_page,
    get_revenue_restr
} = require('../controller/restr.controller')


router.get('/for/revenue/page', protect, for_revenue_restr_page )
router.post('/get/revenue/restr', protect, get_revenue_restr)

module.exports = router