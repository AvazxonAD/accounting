const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')

const { 
    kassa_prixod_and_rasxod 
} = require('../../controller/kassa/kassa.controler')

router.post('/prixod/and/rasxod', protect, kassa_prixod_and_rasxod)

module.exports = router