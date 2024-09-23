const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')
const {
    create,
    getAll,
    getElementById,
    update_shartnoma
} = require('../../controller/shartnoma/shartnoma.controller')

router.post('/create', protect, create)
router.get('/get/all', protect, getAll)
router.get('/get/element/by/:id', protect, getElementById)
router.put('/update/:id', protect, update_shartnoma)

module.exports = router