const { Controller } = require("./controller");
const { validator } = require('../../../helper/validator');
const upload = require('../../../helper/upload')
const {
    createGroupSchema,
    getGroupSchema,
    updateGroupSchema,
    getByIdGroupSchema,
    deleteGroupSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/percent', Controller.getGroupWithPercent)
router.post('/import', upload.single('file'), validator(Controller.importExcel));
router.post('/', validator(Controller.createGroup, createGroupSchema));
router.get('/:id', validator(Controller.getByIdGroup, getByIdGroupSchema));
router.put('/:id', validator(Controller.updateGroup, updateGroupSchema));
router.delete('/:id', validator(Controller.deleteGroup, deleteGroupSchema));
router.get('/', validator(Controller.getGroup, getGroupSchema));


module.exports = router;