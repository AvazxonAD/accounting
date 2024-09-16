const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')
const {
    create,
    getAll, 
    update,
    deleteValue,
    getAlLForLogin
} = require('../../controller/spravochnik/main_schet.controller')

router.post('/create', protect, create)
router.get('/get/all', protect, getAll)
router.put('/update/:id', protect, update)
router.delete('/delete/:id', protect, deleteValue)
router.get('/get/all/for/login', getAlLForLogin)

module.exports = router