const Project = require("../models/project");
const makeDes = require("../modules/descriptor");
const path = require("path");
const fs = require("fs");
const { render } = require("ejs");

//controller to display all projects sorted by time created
const project_index = (req, res) => {
  Project.find({ author: res.locals.user._id })
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("dashboard", { title: "Dashboard", projects: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

// controller to get to create page
const project_create_page = (req, res) => {
  console.log(res.locals.user);
  const project = new Project({
    title: "Untitled",
    method: "Marker",
    lat: 0,
    long: 0,
    gpsRange: 0,
    trigger: [],
    author: res.locals.user._id,
  });

  project
    .save()
    .then((result) => {
      console.log(result);
      //once submitted redirect back to dashboard
      res.redirect("/projects/" + project._id + "/edit");
    })
    .catch((err) => {
      console.log(err);
    });
};

// controller to post info to db
const project_create = (req, res) => {
  //Array to store all triggers
  let triggerList = [];

  //put file into an array if not already one
  if (typeof req.body.trigger_name == "string") {
    req.body.trigger_name = [req.body.trigger_name];
  }

  //for loop to process all triggers and store into array
  for (let i = 0; i < req.body.trigger_name.length; i++) {
    //create the path to image descritors if image tracking is used
    let descriptorPath;
    if (req.body.method == "image") {
      descriptorPath = `/descriptors/${
        path.parse(req.files.imgUpload[i].filename).name
      }`;
      try {
        //makeDes is a function to create image descriptors, argument take the path to image
        makeDes(req.files.imgUpload[i].path);
        // console.log("yee");
      } catch {
        (err) => {
          console.log(err);
        };
      }
    } else {
      descriptorPath = "";
    }

    //keep track of which marker is used for the specific model
    let markerPath;
    if (req.body.method == "marker") {
      if (typeof (req.body.marker == "string")) {
        req.body.marker = [req.body.marker];
      }
      markerPath = `/markers/${req.body.marker[i]}.patt`;
    } else {
      markerPath = "";
    }

    if (typeof req.body.marker == "string") {
      req.body.marker = [req.body.marker];
    }

    //store trigger to server
    triggerList.push({
      //trigger object strcuture
      name: req.body.trigger_name[i],
      marker_path: markerPath,
      descriptor_path: descriptorPath,
      asset_path: `/${req.files.modelFile[i].filename}`,
      asset_type: `${path.extname(req.files.modelFile[i]["originalname"])}`,
      asset_scale: {
        x: req.body.scale_x[i],
        y: req.body.scale_y[i],
        z: req.body.scale_z[i],
      },
      asset_position: {
        x: req.body.position_x[i],
        y: req.body.position_y[i],
        z: req.body.position_z[i],
      },
      asset_rotation: {
        x: req.body.rotation_x[i],
        y: req.body.rotation_y[i],
        z: req.body.rotation_z[i],
      },
    });
  }

  const project = new Project({
    title: req.body.title,
    method: req.body.method,
    lat: req.body.lat,
    long: req.body.long,
    gpsRange: req.body.range,
    trigger: triggerList,
    author: req.body.userID,
  });

  // sending info to db
  project
    .save()
    .then((result) => {
      console.log(result);
      //once submitted redirect back to dashboard
      res.redirect("/dashboard");
    })
    .catch((err) => {
      console.log(err);
    });
};

// controller to display all project infos
const project_detail = (req, res) => {
  const id = req.params.id;
  Project.findById(id)
    .then((result) => {
      res.render("details", { project: result, title: "project details" });
    })
    .catch((err) => {
      console.log(err);
    });
};

// running/testing the ar project
const project_run = (req, res) => {
  const id = req.params.id;
  Project.findById(id)
    .then((result) => {
      //choosing render file based on result method
      switch (result.method) {
        case "marker":
          res.render("marker-model", { project: result, title: "marker demo" });
          break;

        case "gps":
          res.render("gps", { project: result, title: "gps demo" });
          break;

        case "image":
          res.render("image-track", { project: result, title: "image demo" });
          break;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// controller to add trigger in exisiting project
const project_edit = (req, res) => {
  console.log(req.body);
  res.status(204).send();
  let projectId = req.params.id;
  if (req.body.asset_name) {
    Project.findById(projectId).then((result) => {
      result.title = req.body.title;
      result.method = "marker";
      if (typeof req.body.asset_name == "string") {
        req.body.asset_name = [req.body.asset_name];
        req.body.marker_name = [req.body.marker_name];
        req.body.pos_control_x = [req.body.pos_control_x];
        req.body.pos_control_y = [req.body.pos_control_y];
        req.body.pos_control_z = [req.body.pos_control_z];
        req.body.rot_control_x = [req.body.rot_control_x];
        req.body.rot_control_y = [req.body.rot_control_y];
        req.body.rot_control_z = [req.body.rot_control_z];
        req.body.size_control = [req.body.size_control];
      }
      let triggerArray = [];

      for (let i = 0; i < req.body.asset_name.length; i++) {
        let markerPath = req.body.marker_name[i]
          .toLowerCase()
          .split(" ")
          .join("_");
        triggerArray.push({
          asset_name: req.body.asset_name[i],
          marker_name: req.body.marker_name[i],
          asset_path: `/assets/${projectId}/${req.body.asset_name[i]}`,
          asset_type: ".glb",
          marker_path: `/markers/${markerPath}.patt`,
          asset_size: {
            x: req.body.size_control[i],
            y: req.body.size_control[i],
            z: req.body.size_control[i],
          },
          asset_rotation: {
            x: req.body.rot_control_x[i],
            y: req.body.rot_control_y[i],
            z: req.body.rot_control_z[i],
          },
          asset_position: {
            x: req.body.pos_control_x[i],
            y: req.body.pos_control_y[i],
            z: req.body.pos_control_z[i],
          },
        });
      }
      result.trigger = triggerArray;
      try {
        result = result.save();
        console.log("added new trigger");
        res.status(204).send();
      } catch {
        (err) => {
          console.log(err);
        };
      }
    });
  } else {
    Project.findById(projectId).then((result) => {
      result.title = req.body.title;
      result.method = "marker";

      let triggerArray = [];
      result.trigger = triggerArray;
      try {
        result = result.save();
        console.log("no asset");
        res.status(204).send();
      } catch {
        (err) => {
          console.log(err);
        };
      }
    });
  }
  // res.status(200).end();
};

const project_trigger_delete = (req, res) => {
  let projectId = req.params.id;
  let triggerId = req.params.trigger;

  Project.findById(projectId).then((result) => {
    let triggerArray = result.trigger;
    let deleteIndex = triggerArray.findIndex((x) => x._id == triggerId);
    let deleteModelPath = `public${triggerArray[deleteIndex].asset_path}`;

    fs.unlink(deleteModelPath, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("file delete sucess");
      }
    });

    triggerArray.splice(deleteIndex, 1);
    result.trigger = triggerArray;
    try {
      result = result.save();
      console.log(result);
      console.log("save success");
      res.json({ redirect: `/projects/${projectId}/detail` });
    } catch {
      (err) => {
        console.log(err);
      };
    }
  });
};

// controller to delete a whole project
const project_delete = (req, res) => {
  const id = req.params.id;

  // Project.findById(id).then((result) => {
  //   for (let i = 0; i < result.trigger.length; i++) {
  //     deleteModelPath = `public/${result.trigger[i].asset_path}`;
  //     fs.unlink(deleteModelPath, (err) => {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         console.log("file delete sucess");
  //       }
  //     });
  //   }
  // });

  //DELETE function for the asset folder inserted .. :- righ now focusing on one image to check if it works
  Project.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/dashboard" });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  project_index,
  project_detail,
  project_run,
  project_create_page,
  project_create,
  project_edit,
  project_trigger_delete,
  project_delete,
};
