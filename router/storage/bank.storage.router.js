const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')

const {
    createBank,
    getAllBank,
    updateBank,
    deleteBank
} = require('../../controller/storage/bank.sorage.controller')


router.post('/create', protect, createBank)
router.get('/get/all', protect, getAllBank)
router.put('/update/:id', protect, updateBank)
router.delete('/delete/:id', protect, deleteBank)

module.exports = router
