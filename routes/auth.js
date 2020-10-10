const express = require("express");
const { register, login, getMe } = require("../controllers/auth");

const { lock } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", lock, getMe);

module.exports = router;
