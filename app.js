const { render } = require('ejs')
const express = require('express')
const multer = require('multer')
const path = require('path')
const mongoose = require('mongoose')
const Project = require('./models/project')
const fs = require("fs");


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

//submit form information to database
app.post('/projects/', upload.single('modelFile'), (req,res)=>{
    //body is a method from the middleware urlenconded 
    //getting value from form input to submit
    const project = new Project({
        title:req.body.title,
        method:req.body.method,
        // imgDesPath:`/assets/${req.body.imgDesFile.originalname}`,
        filePath: `/assets/${req.file.originalname}`,
        lat:req.body.lat,
        long:req.body.long,
        gpsRange:req.body.range,
    
        })

    // sending info to db
    project.save()
        .then((result)=>{
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