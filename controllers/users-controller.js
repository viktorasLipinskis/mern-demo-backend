const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError("Something went wrong on user getting", 500));
  }

  res.json({ users: users.map((u) => u.toObject({ getters: true })) });
};

const signupUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid input passed, please check your data", 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Signing up failed, please try again later",
      500
    );

    return next(error);
  }

  if (existingUser) {
    return next(
      new HttpError(
        "User is existing already, please use another username",
        422
      )
    );
  }

  const createdUser = new User({
    name,
    email,
    image:
      "https://media-exp1.licdn.com/dms/image/C5103AQEb1E521htbcQ/profile-displayphoto-shrink_400_400/0?e=1599696000&v=beta&t=-0_ry-kc5Hdl4qoaX6pGISwioILvC-onWwOi0PrPa3s",
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Something went wrong on user signup", 500);
    return next(error);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError("Login up failed, please try again later."));
  }

  if (!existingUser || existingUser.password !== password) {
    return next(new HttpError("Invalid credentials, could not log you id."));
  }

  return res.status(200).json({
    message: "Success login!",
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
