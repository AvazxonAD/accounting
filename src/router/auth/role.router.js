const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')
const {
    createRole,
    getAllRole,
    updateRole,
    deleteRole,
    getElementById
} = require('../../controller/auth/role.controller')


router.post('/create', protect, createRole)
router.get('/get/all', protect, getAllRole)
router.put('/update/:id', protect, updateRole)
router.delete('/delete/:id', protect, deleteRole)
router.get('/get/element/by/:id', protect, getElementById)

module.exports = router