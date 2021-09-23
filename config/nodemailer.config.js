const nodemailer = require("nodemailer");
const config = require("../config/auth.config");

const user = config.user;
const pass = config.pass;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  console.log("Check");
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <a href=http://localhost:3000/confirm/${confirmationCode}> Click here</a>
          </div>`,
    })
    .catch((err) => console.log(err));
};

module.exports.sendPasswordResetEmail = (email) => {
  console.log("Check");
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Reflect AR Account",
      html: `<h1>Click the following link to reset</h1>
          <a href=http://localhost:3000/password_reset/${email}> Click here to reset</a>
          </div>`,
    })
    .catch((err) => console.log(err));
  // transport
  //   .sendMail({
  //     from: user,
  //     to: email,
  //     subject: "Reflect AR Account Password Reset",
  //     html: `<h1>Password Reset</h1>
  //     <h2>Please click on the following link to reset password</h2>
  //     <a href="http://localhost:3000/password-reset/${email}">Click here to reset your password</a>
  //     </div>`,
  //   })
  //   .catch((err) => console.log(err));
}