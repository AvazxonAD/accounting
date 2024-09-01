const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')

const {
    create_counterparty,
    get_all_counterparty,
    update_counterparty,
    delete_counterparty
} = require('../../controller/storage/counterparty.storage')


router.post('/create', protect, create_counterparty)
router.get('/get/all', protect, get_all_counterparty)
router.put('/update/:id', protect, update_counterparty)
router.delete('/delete/:id', protect, delete_counterparty)

module.exports = router
