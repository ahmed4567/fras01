
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config
}
const Mongo = require('mongoose');
const uri = "mongodb+srv://admin:01159680878@cluster0.vjlte.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

Mongo.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(console.log("conected to mango"))

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
    let userName = req.body.user_in
    let userBass =req.body.pass_in
    const user =  await Userdb.findOne(userName).lean()
    if(!user){
        return res.json({status:"error",error:"invaled user name or passowrd "})
    } 
    if (await bcrypt.compare(userBass,user.password)){
        const token =jwt.sign({
            id: user._id,
            username: user.stuName
        },JWT_SECRET)
        res.redirect("/user/home")
        return res.json({status:'ok',data :token})
    }
  
    });
    

app.post("/sginUp", async(req, res) => {
    const hashPass = await bcrypt.hash(req.body.password ,10)
    const user = new Userdb ({
        stuName : req.body.stuName,
        stuID : req.body.stuID,
        password : hashPass ,
        Ua : req.body.Ua,
        adminCode: req.body.adminCode
    })
    
    try { 
         await user.save()  
        console.log(`user creted successfuly : ${user}`)
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