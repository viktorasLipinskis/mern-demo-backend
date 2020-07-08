const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

let DUMMY_USERS = [
  {
    id: "u1",
    name: "Viktoras Lipinskis",
    email: "viktoras.lipinskis@gmail.com",
    password: "hello",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signupUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid input passed, please check your data", 422)
    );
  }
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);

  if (hasUser) {
    return next(
      new HttpError("Could not create an user, email already exists.", 422)
    );
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json(createdUser);
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  const existingUser = DUMMY_USERS.find((u) => u.email === email);

  if (existingUser && existingUser.password === password) {
    return res.status(200).json({ message: "Success login!" });
  }

  next(new HttpError("Authentication failed!", 401));
};

exports.getUsers = getUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
