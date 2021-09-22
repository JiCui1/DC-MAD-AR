const express = require("express");
const mongoose = require("mongoose");
const { render } = require("ejs");
const Project = require("./models/project");
const fs = require("fs");

const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

//URI to connect to mongoDB
const dbURI =
  "mongodb+srv://arproject:9xfdrnhSGBm52WYU@ar-info.ixj1r.mongodb.net/ar-info?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((result) => {
    console.log("Connected to db");
    console.log("App listening at localhost:3000");

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
  //if user is logged in, redirect to dashboard
  if (res.locals.user) {
    Project.find({ author: res.locals.user._id })
      .sort({ createdAt: -1 })
      .then((result) => {
        res.render("dashboard", {
          title: "Dashboard",
          user: res.locals.user,
          projects: result,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    //if user is not logged in, render home page
    res.render("index", { title: "HOME", user: res.locals.user });
  }
});

app.get("/confirm", (req, res) => {
  res.render("confirm", { title: "Verify" });
});

//dashboard routes
app.get("/dashboard", requireAuth, (req, res) => {
  Project.find({ author: res.locals.user._id })
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("dashboard", {
        title: "Dashboard",
        user: res.locals.user,
        projects: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/projects/:id/edit", (req, res) => {
  const id = req.params.id;
  const dir = "./public/assets/" + id;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  Project.findById(id)
    .then((result) => {
      res.render("edit", { title: "Edit", project: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

//project routes
app.use("/projects", requireAuth, projectRoutes);
app.use(authRoutes);

//404 page will display if get request not specified
// app.use((req,res)=>{
//     res.status(404).render('404')
// })
