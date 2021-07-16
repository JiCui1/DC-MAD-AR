const User = require("../models/User");

module.exports.signup_get = (req, res) => {
  res.render("signup", { title: "SIGN UP" });
};

module.exports.signup_post = async (req, res) => {

  const { email, password } = req.body;


  try {
    const user = await User.create({ email, password });
    res.status(201).json({ user: user._id });
  } catch (err) {
    console.log(err);
    res.status(400).json({});
  }
};

module.exports.login_get = (req, res) => {
  res.render("login", { title: "LOG IN" });
};

module.exports.login_post = (req, res) => {
  console.log("login");
};
