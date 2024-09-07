const {Router} = require('express') 
const router = Router()

const { protect } = require('../middleware/auth')

const {
    create_revenue,
    for_create_page
} = require('../controller/revenue.controller')


router.post('/create', protect, create_revenue)
router.get('/for/create/page', protect, for_create_page )
router.get('/get/all', protect, )
router.put('/update/:id', protect, )
router.delete('/delete/:id', protect, )

module.exports = router