const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')

const {
    create_shot_number,
    update_shot_number,
    delete_shot_number,
    getAllShotNumbers
} = require('../../controller/storage/shot.storage')


router.post('/create', protect, create_shot_number)
router.get('/get/all', protect, getAllShotNumbers)
router.put('/update/:id', protect, update_shot_number)
router.delete('/delete/:id', protect, delete_shot_number)

module.exports = router
