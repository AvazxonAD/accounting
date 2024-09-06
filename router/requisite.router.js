const {Router} = require('express') 
const router = Router()

const { protect } = require('../middleware/auth')

const {
    create_requsite,
    get_all_requisites,
    update_requisite,
    delete_counterparty
} = require('../controller/requisite.controller')


router.post('/create', protect, create_requsite)
router.get('/get/all', protect, get_all_requisites)
router.put('/update/:id', protect, update_requisite)
router.delete('/delete/:id', protect, delete_counterparty)

module.exports = router