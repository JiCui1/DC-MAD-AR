const { render } = require('ejs')
const express = require('express')
const multer = require('multer')
const path = require('path')
const mongoose = require('mongoose')
const Project = require('./models/project')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const app = express()

//URI to connect to mongoDB
const dbURI = 'mongodb+srv://arproject:9xfdrnhSGBm52WYU@ar-info.ixj1r.mongodb.net/ar-info?retryWrites=true&w=majority'
mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true})
.then((result)=>{
    console.log("Connected to db")

    //localhost:3000 
    app.listen(3000)
    
}).catch((err)=>{
    console.log(err)
})



//register view engine
app.set('view engine','ejs')


//middleware static files (imgs/css)
//allows ejs files to access public folder
app.use(express.static(__dirname+'/public'))
//for form submit value access
app.use(express.urlencoded({extended:true})) 



//basic routes, GET request
app. get('/',(req,res)=>{
    // res.send('<p>HOME</p>')
    const projects = [{title:"TITLE1",snippet:"SJDKASJDKAJSD"},
    {title:"TITLE2",snippet:"SJDKaskdlasjdklSJDKAJSD"},
    {title:"TITLE3",snippet:"SJDKAxzjlkfjawiohaslhfasklSJDKAJSD"}]

    res.render('index', {title:'HOME',projects})
})

app. get('/about',(req,res)=>{
    // res.send('<p>About</p>')
    res.render('about',{title:'ABOUT'})
})



//project routes
app.get('/projects',(req,res)=>{
    //using project model to query all projects in db, -1 sort from newest to oldest by time stamp
    Project.find().sort({createdAt: -1})
        .then((result)=>{
            res.render('all-projects',{title: 'All Projects', projects: result})
        }).catch((err)=>{
            console.log(err)
        })
})


const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        //cb is the callback function, null for errors, public/assets is destination
        cb(null,'public')
    },
    filename: (req,file,cb) => {
        //store the file with the file name
        const ext = path.extname(file.originalname)
        const fileName = file.originalname
        const filePath = `assets/${fileName}`
        // const { originalname } = file;
        cb(null, filePath)
    }
})
const upload = multer({storage})
const multipleUpload = upload.fields([{name:"modelFile", maxCount:10}])

//submit form information to database
app.post('/projects/', multipleUpload, (req,res)=>{
    //body is a method from the middleware urlenconded 
    //getting value from form input to submit

    //list to store all triggers
    let triggerList = []
    console.log(req.body.trigger_name)
    for(let i = 0; i < req.body.trigger_name.length; i++){
        triggerList.push({
            name: req.body.trigger_name[i],
            // marker_path:req.body.marker_path[i],
            // descriptor_path: req.body.descriptor_path[i],
            asset_path: `/assets/${req.files.modelFile[i]["originalname"]}`,
            asset_type: `${path.extname(req.files.modelFile[i]["originalname"])}`,
            asset_scale:{
                x: req.body.scale_x[i],
                y: req.body.scale_y[i],
                z: req.body.scale_z[i],
            },
            asset_position:{
                x: req.body.position_x[i],
                y: req.body.position_y[i],
                z: req.body.position_z[i],
            },
            asset_rotation:{
                x: req.body.rotation_x[i],
                y: req.body.rotation_y[i],
                z: req.body.rotation_z[i],
            },

        })
    }

    const project = new Project({

        title:req.body.title,
        method:req.body.method,
        lat:req.body.lat,
        long:req.body.long,
        gpsRange:req.body.range,
        trigger: triggerList

        })

    // sending info to db
    project.save()
        .then((result)=>{
            console.log(result)
            //once submitted redirect back to all projects page
            res.redirect('/projects')
        }).catch((err)=>{
            console.log(err)
        })
})


//page for form
app.get('/projects/create',(req,res)=>{
    res.render('create',{title:'CREATE'})
})


//single project info/potential url to run application
app.get('/projects/:id/detail',(req,res)=>{
    const id = req.params.id
    Project.findById(id)
    .then(result=>{
        res.render('details',{project:result, title:"project details"})
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/projects/:id',(req,res)=>{
    const id = req.params.id
    Project.findById(id)
    .then(result=>{

        //choosing render while based on result method
        switch (result.method){
            case "marker":
                res.render('marker-model',{project:result,title:"marker demo"})
                break
            
            case "gps":
                res.render('gps',{project:result,title:"gps demo"})
                break

            case "image":
                res.render('image-track',{project:result,title:"image demo"})
                break
        }
        
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/projects/create/image-des-upload',(req,res)=>{
    res.render('des-upload.ejs',{title:"home"})
})

app.post('/des-upload',(req,res)=>{
    
})

//delecte project when delete button clicked
app.delete('/projects/:id',(req,res)=>{

    const id =req.params.id
    

    Project.findById(id)
    .then(result=>{
        deleteModelPath = `public/${result.filePath}`
        fs.unlink(deleteModelPath,(err)=>{
            if(err){
                console.log(err)
            }else{
                console.log('file delete sucess')
            }
        })
    })


    

    //DELETE function for the asset folder inserted .. :- righ now focusing on one image to check if it works

    Project.findById(id)
    .then(result=>{
        const deleteModelPath = `public${result.filePath}`
        fs.unlink(deleteModelPath , function(err) {
            if (err) {
            throw err
                } else {
            console.log("Successfully deleted the file.")
            }
            });

    }).catch((err)=>{
        console.log(err)
    })



    Project.findByIdAndDelete(id)
    .then(result=>{
        res.json({redirect:'/projects'})
    }).catch(err=>{
        console.log(err)
    })
})





//404 page will display if get request not specified
// app.use((req,res)=>{
//     res.status(404).render('404')
// })