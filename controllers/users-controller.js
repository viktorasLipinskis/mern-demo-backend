const { v4: uuid } = require("uuid");

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
  const { name, email, password } = req.body;

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
  const { name, password } = req.body;
  const existingUser = DUMMY_USERS.find((u) => u.email === email);

  if (existingUser && existingUser.password === password) {
    return res.status(200).json({ message: "Success login!" });
  }

  next(new HttpError("Authentication failed!", 401));
};

exports.getUsers = getUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
