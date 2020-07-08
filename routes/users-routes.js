const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users-controller");

router.get("/", usersController.getUsers);
router.post("/signup", usersController.signupUser);
router.post("/login", usersController.loginUser);

module.exports = router;
