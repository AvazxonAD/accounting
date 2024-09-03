const {Router} = require('express') 
const router = Router()

const { protect, adminProtect } = require('../middleware/auth')

const {
    login,
    createUsers,
    update,
    getProfile,
    deleteUser,
    requisitesCreate,
    getRequisites,
    updateRequisite,
    defaultRequisite,
    getDefaultRequisite
} = require('../controller/auth.controller')


router.post('/login', login)
router.post("/create", protect, adminProtect, createUsers)
router.put('/update', protect, update)
router.get("/get", protect, getProfile)
router.delete("/delete/:id", protect, deleteUser)
router.post('/requisites/create', protect, requisitesCreate)
router.get('/get/requisite', protect, getRequisites)
router.put('/update/requisite/:id', protect, updateRequisite)
router.put('/default/requisite', protect, defaultRequisite)
router.get('/get/default/requisite', protect, getDefaultRequisite)

module.exports = router