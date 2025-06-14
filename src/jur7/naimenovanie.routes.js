const { Router } = require("express");
const router = Router();


const { createNaimenovanie, getNaimenovanie, getByIdNaimenovanie, updateNaimenovanie, deleteNaimenovanie } = require("./naimenovanie.contrlller");

router.post("/", createNaimenovanie)
    .get("/", getNaimenovanie)
    .put("/:id", updateNaimenovanie)
    .delete("/:id", deleteNaimenovanie)
    .get("/:id", getByIdNaimenovanie);

module.exports = router;
