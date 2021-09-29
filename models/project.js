const mongoose = require("mongoose");

//schema is the structure of data
const Schema = mongoose.Schema;

//database schema for each project
const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    updated: {
      type: Date,
      default: Date.now,
    },

    method: {
      type: String,
      required: true,
    },

    lat: {
      type: Number,
    },

    long: {
      type: Number,
    },

    gpsRange: {
      type: Number,
    },

    trigger: [
      {
        asset_name: String,
        marker_name: String,
        id: String,
        marker_path: String,
        descriptor_path: String,
        asset_path: { type: String },
        asset_type: { type: String },
        asset_size: {
          x: { type: Number, default: 1 },
          y: { type: Number, default: 1 },
          z: { type: Number, default: 1 },
        },
        asset_rotation: {
          x: { type: Number, default: 0 },
          y: { type: Number, default: 0 },
          z: { type: Number, default: 0 },
        },
        asset_position: {
          x: { type: Number, default: 0 },
          y: { type: Number, default: 0 },
          z: { type: Number, default: 0 },
        },
      },
    ],

    // filePath: {
    //     type:String,
    //     required:true
    // },

    // imgDesPath:{
    //     type: String
    // },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
