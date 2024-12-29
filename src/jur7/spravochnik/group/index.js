const { GroupService } = require("./service");
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

router.get('/percent', validator(GroupService.getGroupWithPercent))
router.post('/import', upload.single('file'), validator(GroupService.importExcel));
router.post('/', validator(GroupService.createGroup, createGroupSchema));
router.get('/:id', validator(GroupService.getByIdGroup, getByIdGroupSchema));
router.put('/:id', validator(GroupService.updateGroup, updateGroupSchema));
router.delete('/:id', validator(GroupService.deleteGroup, deleteGroupSchema));
router.get('/', validator(GroupService.getGroup, getGroupSchema));


module.exports = router;