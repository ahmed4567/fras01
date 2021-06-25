
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config
}
const Mongo = require('mongoose');
const MongoClient = require("mongodb").MongoClient
const uri = "mongodb+srv://admin:01159680878@cluster0.vjlte.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const clint = new MongoClient(uri,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
connection()
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
//Mongo.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(console.log("conected to mango"))

// Require Express to run server and routes
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
//creating main routers 

app.use("/", indexRouter)

app.use("/admin", adminRouter)

app.use("/user", userRouter)

app.set('view engine', 'ejs')

app.set('views', __dirname + '/views')

app.set('layout', 'layouts/layout')

app.use(express.static(__dirname + '/views'));

app.use("/views", express.static("views"))

app.use(cors());

//setup server
const port = 3030;
app.get('/', (req, res) => {
        res.render('../Views/logIN/login')
    })
    //routs post
    
    app.post('/signIN', async (req, res) => {
        const db = clint.db()
        const users = await db.collection("userschemas")
        //console.log(users)
    let userName = req.body.user_in
    let userBass =req.body.pass_in
    const user =  await users.findOne({stuName : `${userName}`})
    console.log(user)

   
    if (await bcrypt.compare(userBass,user.password)){
        const token =jwt.sign({
            id: user._id,
            username: user.stuName
        },JWT_SECRET)
        res.redirect("/user/")
    }
  
    });
    

app.post("/sginUp", async(req, res) => {
    const db = clint.db()
    const users = await db.collection("userschemas")   
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
    }
})

const server = app.listen(process.env.PORT || port, listening);

function listening() {
    console.log(`server running on http://localhost:${port}`)
}