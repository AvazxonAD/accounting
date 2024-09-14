const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')

const {
    create_expense,
    for_create_page
} = require('../../controller/2-jurnal/expense.controller')


router.post('/create', protect, create_expense)
router.get('/for/create/page', protect, for_create_page )
router.get('/get/all', protect, )
router.put('/update/:id', protect, )
router.delete('/delete/:id', protect, )

module.exports = router