const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controller");

const router = express.Router();
router.get("/", usersController.getUsers);
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 4 }),
  ],
  usersController.signupUser
);
router.post("/login", usersController.loginUser);

module.exports = router;
