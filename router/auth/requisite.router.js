const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')

const {
    create_requsite,
    get_all_requisites,
    update_requisite,
    delete_counterparty,
    change_requisite_by_id,
    get_default_requisite
} = require('../../controller/auth/requisite.controller')


router.post('/create', protect, create_requsite)
router.get('/get/all', protect, get_all_requisites)
router.put('/update/:id', protect, update_requisite)
router.delete('/delete/:id', protect, delete_counterparty)
router.put('/change/requisite/by/id/:id', protect, change_requisite_by_id)
router.get('/get/default/requisite', protect, get_default_requisite)

module.exports = router