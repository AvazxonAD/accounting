const { Router } = require("express");
const router = Router();


const {
    groupCreate,
    getgroup,
    getByIdgroup,
    updategroup,
    deletegroup
} = require("./group.jur7.controller");

router.post("/", groupCreate)
    .get("/", getgroup)
    .put("/:id", updategroup)
    .delete("/:id", deletegroup)
    .get("/:id", getByIdgroup); 

module.exports = router;
