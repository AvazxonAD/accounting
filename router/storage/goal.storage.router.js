const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')

const {
    createGoal,
    getAllGoal,
    updateGoal,
    deleteGoal
} = require('../../controller/storage/goal.storage.controller')


router.post('/create', protect, createGoal)
router.get('/get/all', protect, getAllGoal)
router.put('/update/:id', protect,updateGoal )
router.delete('/delete/:id', protect, deleteGoal)

module.exports = router
