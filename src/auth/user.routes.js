const { Router } = require("express");
const router = Router();

const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getByIdUser
} = require("./user.controller");

router.post("/", createUser)
  .get("/:id", getByIdUser)
  .get("/", getUser)
  .put("/:id", updateUser)
  .delete("/:id", deleteUser);



module.exports = router;
