const {Router} = require('express') 
const router = Router()

const upload = require('../../utils/protect.file')

const { protect } = require('../../middleware/auth')
const {
    create,
    getAll, 
    update,
    deleteValue,
    importToExcel
} = require('../../controller/spravochnik/podotchet_litso.controller')


router.post('/create', protect, create)
router.get('/get/all', protect, getAll)
router.put('/update/:id', protect, update)
router.delete('/delete/:id', protect, deleteValue)
router.post('/import/excel', protect, upload.single('file'), importToExcel)

module.exports = router