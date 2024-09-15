const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')
const { check_super_admin } = require('../../utils/auth/check.role')
const {
    createRole,
    getAllRole,
    updateRole,
    deleteRole
} = require('../../controller/auth/role.controller')


router.post('/create', protect, check_super_admin, createRole)
router.get('/get/all', protect, check_super_admin, getAllRole)
router.put('/update/:id', protect, check_super_admin, updateRole)
router.delete('/delete/:id', protect, check_super_admin, deleteRole)

module.exports = router