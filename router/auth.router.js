const {Router} = require('express') 
const router = Router()

const { protect, adminProtect } = require('../middleware/auth')

const {
    login,
    createUsers,
    updateAdmin,
    updateUser,
    updateUserByAdmin,
    getProfile,
    deleteUser,
    requisitesCreate,
    getRequisites,
    updateRequisite
} = require('../controller/auth.controller')


router.post('/login', login)
router.post("/create", protect, adminProtect, createUsers)
router.put('/update/admin', protect, adminProtect, updateAdmin)
router.put('/update/user', protect, updateUser)
router.put('/update/user/by/admin/:id', protect, adminProtect, updateUserByAdmin)
router.get("/get", protect, getProfile)
router.delete("/delete/:id", protect, deleteUser)
router.post('/requisites/create', protect, requisitesCreate)
router.get('/get/requisite', protect, getRequisites)
router.put('/update/requisite/:id', protect, updateRequisite)

module.exports = router