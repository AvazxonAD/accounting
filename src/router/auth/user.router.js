const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')

const {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser,
    getElementById
} = require('../../controller/auth/user.controller')


router.post('/create', protect, createUser)
router.get('/get/all/:id',  protect, getAllUsers)
router.put('/update/:id', protect, updateUser)
router.delete('/delete/:id', protect, deleteUser)
router.get('/get/element/by/:id', protect, getElementById)

module.exports = router 