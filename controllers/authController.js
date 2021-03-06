const User = require("../models/User");
const jwt = require("jsonwebtoken");

const { sendConfirmationEmail, sendPasswordResetEmail } = require("../config/nodemailer.config");

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  //login errors
  if (err.message == "incorrect email") {
    errors.email = "the email is not registered";
  }

  if (err.message == "Email is not confirmed") {
    errors.email = "Email is not confirmed";
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

//3 days of max age in seconds, how long will the token be valid
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "dc mad secret", {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup", { title: "SIGN UP" });
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const confirmToken = jwt.sign({ email: req.body.email }, "dc mad secret");
    const user = await User.create({
      email,
      password,
      confirmationCode: confirmToken,
    });

    sendConfirmationEmail("random person", email, confirmToken);
    const token = createToken(user._id);
    //http only stops jwt accessing from front end
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
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
    console.log(user);
    if (user.status != "Active") {
      throw Error("Email is not confirmed");
    } else {
      const token = createToken(user._id);
      //maxAge * 1000 is maxAge in milliseconds
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      console.log("login success");
      console.log(user._id);
      res.status(201).json({ user: user._id });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports.verifyUser = (req, res) => {
  User.findOneAndUpdate(
    {
      confirmationCode: req.params.confirmationCode,
    },
    { confirmationCode: req.params.confirmationCode, status: "Active" },
    (err) => {
      if (err) {
        console.log("error", e);
      }
    }
  ).then((user) => {
    console.log(user);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    console.log("login success");
    res.redirect("/");
  });
};

//Getting account email
module.exports.password_reset_get = (req, res) => {
  res.render("password_reset", { title: "Password Reset" });
};

//Sending reset email
module.exports.password_reset_post = async (req, res) => {
  const { email } = req.body;

  try {
    

    sendPasswordResetEmail(email);
    //http only stops jwt accessing from front end
    res.status(201).json({ email })
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

//Page Render for changing password
module.exports.pass_reset_get = (req,res)=>{
  const email = req.params.email
  res.render("reset",{title:"Password Reset", email})
}

//Post request to set new password
module.exports.pass_reset_post = async (req,res)=>{
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      user.password = req.body.password;
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.status(201).json({ user: user._id });
      });
    })
    .catch((e) => console.log("error", e));
}