const {Router} = require('express') 
const router = Router()

const { protect } = require('../middleware/auth')

const {
    atchotHat
} = require('../controller/result.controller')

router.get('/hat', protect, atchotHat)


module.exports = router
