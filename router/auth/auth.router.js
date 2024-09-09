const {Router} = require('express') 
const router = Router()

const { protect, adminProtect } = require('../../middleware/auth')

const {
    login,
    createUsers,
    update,
    getProfile,
    deleteUser
} = require('../../controller/auth/auth.controller')


router.post('/login', login)
router.post("/create", protect, adminProtect, createUsers)
router.put('/update', protect, update)
router.get("/get", protect, getProfile)
router.delete("/delete/:id", protect, deleteUser)

module.exports = router