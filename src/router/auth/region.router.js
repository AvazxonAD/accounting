const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')
const { check_super_admin } = require('../../utils/auth/check.role')
const {
    createRegion,
    getAllReegions,
    updateRegion,
    deleteRegion,
    getElementById
} = require('../../controller/auth/region.ccontroller')


router.post('/create', protect, createRegion)
router.get('/get/all', protect, getAllReegions)
router.put('/update/:id', protect, updateRegion)
router.delete('/delete/:id', protect, deleteRegion)
router.get('/get/element/by/:id', protect, getElementById)

module.exports = router