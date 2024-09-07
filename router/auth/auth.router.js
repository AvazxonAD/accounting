const {Router} = require('express') 
const router = Router()

const { protect, adminProtect } = require('../../middleware/auth')

const {
    login,
    createUsers,
    update,
    getProfile,
    deleteUser,
    position_create,
    get_all_positions,
    update_position,
    delete_position
} = require('../../controller/auth/auth.controller')


router.post('/login', login)
router.post("/create", protect, adminProtect, createUsers)
router.put('/update', protect, update)
router.get("/get", protect, getProfile)
router.delete("/delete/:id", protect, deleteUser)

router.post('/position/create', protect, position_create)
router.get('/position/get/all', protect, get_all_positions)
router.put('/position/update/:id', protect, update_position)
router.delete('/position/delete/:id', protect, delete_position)

module.exports = router