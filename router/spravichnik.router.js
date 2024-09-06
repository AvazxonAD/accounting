const {Router} = require('express') 
const router = Router()

const { protect } = require('../middleware/auth')

const {
    create_partner,
    get_all_partner,
    update_partner,
    delete_partner,
    goal_create,
    get_all_goal_status_true,
    get_all_goal_status_false,
    update_goal,
    delete_goal
} = require('../controller/spravichnik.controller')

router.post('/goal/create', protect, goal_create)
router.get('/goal/true/get/all', protect, get_all_goal_status_true)
router.get('/goal/false/get/all', protect, get_all_goal_status_false)
router.put('/goal/update/:id', protect, update_goal)
router.delete('/goal/delete/:id', protect, delete_goal)

router.post('/partner/create', protect, create_partner)
router.get('/partner/get/all', protect, get_all_partner)
router.put('/partner/update/:id', protect, update_partner)
router.delete('/partner/delete/:id', protect, delete_partner)


module.exports = router