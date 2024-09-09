const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')

const {
    position_create,
    get_all_positions,
    update_position,
    delete_position
} = require('../../controller/auth/position.controler')

router.post('/position/create', protect, position_create)
router.get('/position/get/all', protect, get_all_positions)
router.put('/position/update/:id', protect, update_position)
router.delete('/position/delete/:id', protect, delete_position)

module.exports = router