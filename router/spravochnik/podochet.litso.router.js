const {Router} = require('express') 
const router = Router()

const { protect } = require('../../middleware/auth')
const {
    create,
    getAll, 
    update,
    deleteValue
} = require('../../controller/spravochnik/podotchet_litso.controller')


router.post('/create', protect, create)
router.get('/get/all', protect, getAll)
router.put('/update/:id', protect, update)
router.delete('/delete/:id', protect, deleteValue)

module.exports = router