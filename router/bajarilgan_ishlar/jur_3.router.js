const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')

const { 
    jur_3_create
} = require('../../controller/bajarilgan_ishlar/jur_3.controller')

router.post('/create', protect, jur_3_create)
router.get('/get/all/prixod/rasxod', protect, )
router.put('/prixod/rasxod/update/:id', protect, )
router.delete('/delete/prixod/rasxod/:id', protect, )
router.get('/get/element/by/id/prixod/rasxod/:id', protect, )

module.exports = router