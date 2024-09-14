const {Router} = require('express') 
const router = Router()

const { protect, adminProtect } = require('../../middleware/auth')

const {
    login,
    createUsers,
    update,
    getProfile,
    deleteUser,
    createRegion
} = require('../../controller/auth/auth.controller')


router.post('/login', login)
router.post("/user/create", protect, adminProtect, createUsers)
router.put('/update', protect, update)
router.get("/get", protect, getProfile)
router.delete("/delete/:id", protect, deleteUser)
router.post('/create/region', protect, createRegion)

module.exports = router