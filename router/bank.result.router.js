const {Router} = require('express') 
const router = Router()

const { protect } = require('../middleware/auth')

const {
    get_result_1
} = require('../controller/bank.result.controller')


router.get('/get/result_1', protect, get_result_1)

module.exports = router
