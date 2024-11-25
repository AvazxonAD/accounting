const { PodrazdelenieService } = require("./service");
const { Controller } = require('../../helper/controller');
const {
    createPodrazdelenieSchema,
    getPodrazdelenieSchema,
    updatePodrazdelenieSchema,
    getByIdPodrazdelenieSchema,
    deletePodrazdelenieSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', Controller(PodrazdelenieService.createPodrazdelenie, createPodrazdelenieSchema));
router.get('/:id', Controller(PodrazdelenieService.getByIdPodrazdelenie, getByIdPodrazdelenieSchema));
router.put('/:id', Controller(PodrazdelenieService.updatePodrazdelenie, updatePodrazdelenieSchema));
router.delete('/:id', Controller(PodrazdelenieService.deletePodrazdelenie, deletePodrazdelenieSchema));
router.get('/', Controller(PodrazdelenieService.getPodrazdelenie, getPodrazdelenieSchema));


module.exports = router;