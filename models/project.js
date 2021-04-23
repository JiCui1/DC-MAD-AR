const mongoose = require('mongoose')

//schema is the structure of data
const Schema = mongoose.Schema

const projectSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    method:{
        type: String,
        required:true
    },

    filePath: {
        type:String,
        required:true
    }

},{timestamps:true})


const Project = mongoose.model('Project',projectSchema)

module.exports = Project