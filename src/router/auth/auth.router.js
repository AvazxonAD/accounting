const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");

const {
  login,
  update,
  getProfile,
  select_budget,
  forLogin
} = require("../../controller/auth/auth.controller");

router.post("/login", login);
router.patch("/update", protect, update);
router.get("/get", protect, getProfile);
router.get("/select/budjet/:id", select_budget);
router.get('/for/login', forLogin)

module.exports = router;
