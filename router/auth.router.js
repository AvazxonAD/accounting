const {Router} = require('express') 
const router = Router()

const { protect, adminProtect } = require('../middleware/auth')

const {
    login,
    createUsers,
    update,
    getProfile,
    deleteUser,
    updateRequisite,
    getDefaultRequisite,
    forUpdateRequisite
} = require('../controller/auth.controller')


router.post('/login', login)
router.post("/create", protect, adminProtect, createUsers)
router.put('/update', protect, update)
router.get("/get", protect, getProfile)
router.delete("/delete/:id", protect, deleteUser)
router.put('/update/requisite', protect, updateRequisite)
router.get('/get/default/requisite', protect, getDefaultRequisite)
router.get('/for/update/requisite', protect, forUpdateRequisite)


module.exports = router