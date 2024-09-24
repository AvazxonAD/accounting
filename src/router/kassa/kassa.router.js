const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')

const { 
    kassa_prixod_and_rasxod,
    getAllKassaPrixodRasxod,
    updateKassaPrixodBank,
    deleteKassaPrixodRasxod,
    getElementByIdKassaPrixodRasxod
} = require('../../controller/kassa/kassa.controler')

router.post('/prixod/and/rasxod', protect, kassa_prixod_and_rasxod)
router.get('/get/all/prixod/rasxod', protect, getAllKassaPrixodRasxod)
router.put('/prixod/rasxod/update/:id', protect, updateKassaPrixodBank)
router.delete('/delete/prixod/rasxod/:id', protect, deleteKassaPrixodRasxod)
router.get('/get/element/by/id/prixod/rasxod/:id', protect, getElementByIdKassaPrixodRasxod)

module.exports = router