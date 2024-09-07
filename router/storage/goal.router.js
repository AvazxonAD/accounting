const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')

const {
    goal_create,
    get_all_goal_status_true,
    get_all_goal_status_false,
    update_goal,
    delete_goal
} = require('../../controller/storage/goal.controller')

router.post('/goal/create', protect, goal_create)
router.get('/goal/true/get/all', protect, get_all_goal_status_true)
router.get('/goal/false/get/all', protect, get_all_goal_status_false)
router.put('/goal/update/:id', protect, update_goal)
router.delete('/goal/delete/:id', protect, delete_goal)


module.exports = router