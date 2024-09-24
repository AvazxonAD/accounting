const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')

const { 
    jur_3_create,
    jur_3_get_all,
    jur_3_update,
    getElementByIdJur_3,
    deleteJur_3
} = require('../../controller/bajarilgan_ishlar/jur_3.controller')

router.post('/jur_3/create', protect, jur_3_create)
router.get('/jur_3/get/all', protect, jur_3_get_all)
router.put('/jur_3/update/:id', protect, jur_3_update)
router.delete('/jur_3/delete/:id', protect, deleteJur_3)
router.get('/get/element/by/id/jur_3/:id', protect, getElementByIdJur_3)

module.exports = router