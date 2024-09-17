const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')

const {
    login,
    update,
    getProfile,
    select_budget
} = require('../../controller/auth/auth.controller')


router.post('/login', login)
router.patch('/update', protect, update)
router.get("/get", protect, getProfile)
router.post('/select/budjet', protect, select_budget)


module.exports = router