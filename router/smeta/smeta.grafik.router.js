const {Router} = require('express') 
const router = Router()


const { protect } = require('../../middleware/auth')
const {
    create,
    getAll, 
    update,
    deleteValue,
    getElemnetById
} = require('../../controller/smeta/smeta.grafik.controller')


router.post('/create', protect, create)
router.get('/get/all', protect, getAll)
router.put('/update/:id', protect, update)
router.delete('/delete/:id', protect, deleteValue)
router.use('/get/element/by/:id', protect, getElemnetById)

module.exports = router