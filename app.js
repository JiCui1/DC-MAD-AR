const { render } = require('ejs')
const express = require('express')
const mongoose = require('mongoose')
const Project = require('./models/project')

const app = express()

//URI to connect to mongoDB
const dbURI = 'mongodb+srv://arproject:9xfdrnhSGBm52WYU@ar-info.ixj1r.mongodb.net/ar-info?retryWrites=true&w=majority'
mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true})
.then((result)=>{
    console.log("Connected to db")

    //localhose:3000 
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


//submit form information to database
app.post('/projects/',(req,res)=>{
    //body is a method from the middleware urlenconded 
    //getting value from form input to submit
    const project = new Project(req.body)

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
app.get('/projects/:id',(req,res)=>{
    const id = req.params.id
    Project.findById(id)
    .then(result=>{
        res.render('details',{project:result, title:"project details"})
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

//404 page will display if get request not specified
app.use((req,res)=>{
    res.status(404).render('404')
})