const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  status: {
    type: String,
    enum: ["Pending", "Active"],
    default: "Pending",
  },
  confirmationCode: {
    type: String,
    unique: true,
  },
});

//hashing password before saving
userSchema.pre("save", async function (next) {
  User.find({ username: this.username });
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  //next to run the next middleware after this
  next();
});

//log the user after it is saved to db
userSchema.post("save", async function (doc, next) {
  console.log("new user is created and saved", doc);
  next();
});

//static method to log user in
userSchema.statics.login = async function (email, password) {
  console.log("finding user");
  const user = await this.findOne({ email });
  //check if email is registered
  if (user) {
    console.log("user found");
    //if email is registered, check if password is correct
    const auth = await bcrypt.compare(password, user.password);
    //if password is also correct, return the user info
    if (auth) {
      console.log("password correct");
      return user;
    }

    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
