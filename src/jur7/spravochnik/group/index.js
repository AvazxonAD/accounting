const { GroupService } = require("./service");
const { Controller } = require('../../../helper/controller');
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

router.get('/percent', Controller(GroupService.getGroupWithPercent))
router.post('/import', upload.single('file'), Controller(GroupService.importExcel));
router.post('/', Controller(GroupService.createGroup, createGroupSchema));
router.get('/:id', Controller(GroupService.getByIdGroup, getByIdGroupSchema));
router.put('/:id', Controller(GroupService.updateGroup, updateGroupSchema));
router.delete('/:id', Controller(GroupService.deleteGroup, deleteGroupSchema));
router.get('/', Controller(GroupService.getGroup, getGroupSchema));


module.exports = router;