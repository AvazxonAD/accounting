const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')
const {
    create,
    getAll
} = require('../../controller/shartnoma/shartnoma.controller')

router.post('/create', protect, create)
router.get('/get/all', protect, getAll)

module.exports = router