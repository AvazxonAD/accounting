const {Router} = require('express') 
const router = Router()

const { protect } = require('../middleware/auth')

const {
    create_contract,
    getAllContracts,
    getElementById
} = require('../controller/contract.controller')


router.post('/create', protect, create_contract)
router.get('/get/all', protect, getAllContracts)
router.get('/get/:id', protect, getElementById)
router.put('/update/:id', protect, )
router.delete('/delete/:id', protect, )

module.exports = router
