const express = require("express");
const mongoose = require("mongoose");
const { render } = require("ejs");

const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

//URI to connect to mongoDB
const dbURI =
  "mongodb+srv://arproject:9xfdrnhSGBm52WYU@ar-info.ixj1r.mongodb.net/ar-info?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Connected to db");

    //localhost:3000
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

//register view engine
app.set("view engine", "ejs");

//middleware static files (imgs/css)
//allows ejs files to access public folder
app.use(express.static(__dirname + "/public"));

//for form submit value access
app.use(express.urlencoded({ extended: true }));

//to use json data
app.use(express.json());

//access to cookie
app.use(cookieParser());

//check if user exist
app.get("*", checkUser);

//basic routes, GET request
app.get("/", (req, res) => {
  res.render("index", { title: "HOME", user: res.locals.user });
});

app.get("/dashboard", requireAuth, (req, res) => {
  res.render("dashboard", { title: "dashboard", user: res.locals.user });
});

//project routes
app.use("/projects", requireAuth, projectRoutes);
app.use(authRoutes);

//404 page will display if get request not specified
// app.use((req,res)=>{
//     res.status(404).render('404')
// })
