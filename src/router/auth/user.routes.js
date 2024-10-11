const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");

const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getByIdUser
} = require("../../controller/auth/user.controller");

router.post("/", createUser)
  .get("/:id", getByIdUser)
  .get("/", getUser)
  .put("/:id", updateUser)
  .delete("/:id", deleteUser);



module.exports = router;
