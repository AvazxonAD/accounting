const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')
const { check_super_admin } = require('../../utils/auth/check.role')
const {
    createRegion,
    getAllReegions,
    updateRegion,
    deleteRegion
} = require('../../controller/auth/region.ccontroller')


router.post('/create', protect, check_super_admin, createRegion)
router.get('/get/all', protect, check_super_admin, getAllReegions)
router.put('/update/:id', protect, check_super_admin, updateRegion)
router.delete('/delete/:id', protect, check_super_admin, deleteRegion)

module.exports = router