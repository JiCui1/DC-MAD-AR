const express = require('express')
const path = require('path')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const projectController = require('../controllers/projectController')
const router = express.Router()


//project routes
router.get('/',projectController.project_index)


//multer storage to upload files to server
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        //cb is the callback function, null for errors, public/assets is destination
        cb(null,'public')
    },
    filename: (req,file,cb) => {
        //store the file with the file name
        const ext = path.extname(file.originalname)
        const fileName = uuidv4()+'-'+file.originalname
        let filePath = `assets/${fileName}`

        // const { originalname } = file;
        cb(null, filePath)
    }
})

const upload = multer({storage})
const multipleUpload = upload.fields([{name:"modelFile", maxCount:10},{name:"imgUpload", maxCount:10}])

//submit form information to database
router.post('/', multipleUpload, projectController.project_create)


//page for form, create route needs to be above the id route
router.get('/create',projectController.project_create_page)


//single project info/potential url to run application
router.get('/:id/detail',projectController.project_detail)


// route to run/test the project
router.get('/:id',projectController.project_run)


//route to add more triggers to a project
router.post('/:id/add',multipleUpload,projectController.project_add)


//route to edit info of a project(rotation,position,scale)
router.post('/:id/:trigger/edit',projectController.project_edit)


//route to delete a trigger in a existing project
router.put('/:id/:trigger/delete',projectController.project_trigger_delete)




//delecte project when delete button clicked
router.delete('/:id',projectController.project_delete)


module.exports = router