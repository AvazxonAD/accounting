const {Router} = require('express') 
const router = Router()

const { protect } = require('../middleware/auth')

const {
    create_partner
} = require('../controller/spravichnik.controller')


router.post('/partner/create', protect, create_partner)
router.get('/get/all', protect, )
router.put('/update/:id', protect, )
router.delete('/delete/:id', protect, )

module.exports = router