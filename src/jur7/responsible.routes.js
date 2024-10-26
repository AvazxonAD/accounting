const { Router } = require("express");
const router = Router();


const {
    responsibleCreate,
    getResponsible,
    getByIdResponsible,
    updateResponsible,
    deleteResponsible
} = require("./responsible.controller");

router.post("/", responsibleCreate)
    .get("/", getResponsible)
    .put("/:id", updateResponsible)
    .delete("/:id", deleteResponsible)
    .get("/:id", getByIdResponsible); 

module.exports = router;
