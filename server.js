
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config
}
//db set up 

const Mongo = require('mongoose');
const MongoClient = require("mongodb").MongoClient
const uri = "mongodb+srv://admin:01159680878@cluster0.vjlte.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const clint = new MongoClient(uri,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
connection()

// Require 

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const faceApi = require('face-api.js')
const jwt = require("jsonwebtoken")
const JWT_SECRET = "$2a$10$lPKs4fQWZermy1oq061FjeKnYGk8X448w3vhCzOCQSlWQyQHYGTPa"
const indexRouter = require("./routs/routs")
const adminRouter = require("./routs/admin")
const userRouter = require("./routs/user")
const mongo = require('mongoose')
const Userdb = require("./dataBase/userDb")
const bcrypt = require("bcryptjs");
const { json } = require('body-parser');

//creat app
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
const port = 3030;
const server = app.listen(process.env.PORT || port, listening);

//creating main routers 

app.use("/", indexRouter)

app.use("/admin", adminRouter)

app.use("/user", userRouter)

app.set('view engine', 'ejs')

app.set('views', __dirname + '/views')

app.set('layout', 'layouts/layout')

app.use(express.static(__dirname + '/views'));

app.use("/views", express.static("views"))


//get routs

app.get('/', (req, res) => {
        res.render('../Views/logIN/login')
    })
    
    
//post routs
    
app.post('/signIN', async (req, res) => {
        const db = clint.db()
        const users = await db.collection("userschemas")
        const admins = await db.collection("admins")
        
    let userName = req.body.user_in
    let userBass =req.body.pass_in
    const user =  await users.findOne({stuName : `${userName}`})
    const admin =  await admins.findOne({stuName : `${userName}`})
    try{
        if(admin === null){
        if(await bcrypt.compare(userBass,user.password))
        {
            const token =jwt.sign({
                id: user._id,
                username: user.stuName
            },JWT_SECRET)
            res.redirect("/user/")
        }
        }else if(user === null)
        {
        if(await bcrypt.compare(userBass,admin.password))
        {
            const token =jwt.sign({
                id: admin._id,
                username: admin.adminName
            },JWT_SECRET)
            res.redirect("/admin/")
        }
    }else{ 
        res.json("user/pasoword not valed ")

    }
    }catch(error){
         console.error()
    }
})
    

app.post("/sginUp", async(req, res) => {
    const db = clint.db()
    const users = await db.collection("userschemas")   
    const admins = await db.collection("admins")
    const adminCodeV = req.body.adminCode
    const admin = await admins.findOne({adminCode : `${adminCodeV}`})     

    if(admin !== null){
    const hashPass = await bcrypt.hash(req.body.password ,10)
    const user = {
        stuName : req.body.stuName,
        stuID : req.body.stuID,
        password : hashPass ,
        Ua : req.body.Ua,
        adminCode: req.body.adminCode
    }
    
    try { 
         await users.insertOne(user)  
        console.log(`user creted successfuly :`)
        res.redirect("/")
    } catch (error) {
        console.log(error)
        return res.json({status:'error'})
    }}
})

//functions 

async function connection() {
    try {
        await clint.connect();
        const db = clint.db()
        const users = await db.collection("users")
        console.log("conected to mongos")
        return users
    } catch (e) {
        console.log(e)
    }
}

//setup server

function listening() {
    console.log(`server running on http://localhost:${port}`)
}