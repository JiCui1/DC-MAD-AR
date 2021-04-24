# How to test

Start app with

```bash
node app
```

test url

localhost:3000/projects/<project-id>

replace project-id with the actual id of project which you can find in localhost:3000/projects

# Dependency

mongoose: mongoDB framework to make CRUD operation

express: node js framework

ejs: view engine to output data from DB to front end

multer: middleware to upload file to folder

# Project Structure

Public: Place to store express static information like css file/assets folder for ejs to get access

Views: ejs files to for node js to render to front end

Partials: Folder to hold resuable code like html head

# Instruction

Add remote origin by using

```bash
git remote add origin https://github.com/JiCui1/DC-MAD-AR.git
```

Fetch branch by using

```bash
git fetch --all or git fetch <branch name>
```

Pull from development branch by using

```bash
git pull origin development
```

Push to development branch by using

```bash
git push origin development
```
