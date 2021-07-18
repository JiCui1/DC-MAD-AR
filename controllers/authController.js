const User = require("../models/User");

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  //login errors
  if (err.message == "incorrect email") {
    errors.email = "the email is not registered";
  }

  if (err.message == "incorrect password") {
    errors.password = "ths password does not match";
  }

  //duplicate key error for sign up
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }

  //validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports.signup_get = (req, res) => {
  res.render("signup", { title: "SIGN UP" });
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    console.log(user._id);
    res.status(201).json({ user: user._id });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_get = (req, res) => {
  res.render("login", { title: "LOG IN" });
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.login(email, password);
    console.log("login success");
    console.log(user._id);
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
