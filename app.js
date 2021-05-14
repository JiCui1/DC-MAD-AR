const express = require('express')
const mongoose = require('mongoose')
<<<<<<< HEAD
const { render } = require('ejs')

=======
const Project = require('./models/project')
const router = express.Router();
>>>>>>> cf41ac2fa9a7658c2475276f5ee085eef9525d11

const projectRoutes = require("./routes/projectRoutes")

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
app.get('/',(req,res)=>{
    // res.send('<p>HOME</p>')
    const projects = [{title:"TITLE1",snippet:"SJDKASJDKAJSD"},
    {title:"TITLE2",snippet:"SJDKaskdlasjdklSJDKAJSD"},
    {title:"TITLE3",snippet:"SJDKAxzjlkfjawiohaslhfasklSJDKAJSD"}]

    res.render('index', {title:'HOME',projects})
})



//project routes
app.use('/projects',projectRoutes)


<<<<<<< HEAD
=======
//page for form
app.get('/projects/create',(req,res)=>{
    res.render('create',{title:'CREATE'})
})

//single project info/potential url to run application
app.get('/projects/:id/detail',(req,res)=>{
    const id = req.params.id
    Project.findById(id)
    .then(result=>{
        console.log(result)
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


//delecte project when delete button clicked
app.delete('/projects/:id',(req,res)=>{

    const id =req.params.id

    Project.findByIdAndDelete(id)
    .then(result=>{
        res.json({redirect:'/projects'})
    }).catch(err=>{
        console.log(err)
    })
})
>>>>>>> cf41ac2fa9a7658c2475276f5ee085eef9525d11


//404 page will display if get request not specified
// app.use((req,res)=>{
//     res.status(404).render('404')
// })