const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')

const {
    create_account_number,
    update_account_number,
    delete_account_number,
    getAllShotNumbers
} = require('../../controller/storage/account.number.storage')


router.post('/create', protect, create_account_number)
router.get('/get/all', protect, getAllShotNumbers)
router.put('/update/:id', protect, update_account_number)
router.delete('/delete/:id', protect, delete_account_number)

module.exports = router
