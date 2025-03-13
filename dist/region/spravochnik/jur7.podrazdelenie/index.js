"use strict";

var _require = require("./controller"),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  createPodrazdelenieSchema = _require3.createPodrazdelenieSchema,
  getPodrazdelenieSchema = _require3.getPodrazdelenieSchema,
  updatePodrazdelenieSchema = _require3.updatePodrazdelenieSchema,
  getByIdPodrazdelenieSchema = _require3.getByIdPodrazdelenieSchema,
  deletePodrazdelenieSchema = _require3.deletePodrazdelenieSchema,
  PodrazSchema = _require3.PodrazSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.post('/', validator(Controller.createPodrazdelenie, createPodrazdelenieSchema)).get('/:id', validator(Controller.getByIdPodrazdelenie, getByIdPodrazdelenieSchema)).put('/:id', validator(Controller.updatePodrazdelenie, updatePodrazdelenieSchema))["delete"]('/:id', validator(Controller.deletePodrazdelenie, deletePodrazdelenieSchema)).get('/', validator(Controller.getPodrazdelenie, getPodrazdelenieSchema));
module.exports = router;