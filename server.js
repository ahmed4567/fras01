if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config
}

//db set up 
const Mongo = require('mongoose');
const MongoClient = require("mongodb").MongoClient
const uri = "mongodb://127.0.0.1:27017/";
const clint = new MongoClient(uri,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
connection()

// Require 
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const momment = require('moment')
const webrtc = require("wrtc");
let senderStream;

//sokit io
const io = require("socket.io")(http);


//authinticatio 
const session = require("express-session")
const flash = require("express-flash")
const LocalStorage =require("passport-local")
const passport = require("passport")
const cookieParser = require('cookie-parser')
const getUserByUsername = async(user)=>{
    const db = clint.db()
    const instructor =  await db.collection("instructors").findOne({username : `${user}`})
    const stu =  await db.collection("user").findOne({username : `${user}`})
    if(stu === null){
        return  [instructor]
    }else{
        return [stu]
    }
}
const getUserByID = async(user)=>{
    const db = clint.db()
    const instructor =  await db.collection("instructors").findOne({adminID : `${user.body.adminID}`})
    const stu =  await db.collection("user").findOne({password : `${user.userID}`})
    if(stu === null){
        return [instructor]
    }else{
        return [stu]
    }
}
passport.use(new LocalStorage(async (username,password,done)=>{
    const a = getUserByUsername(username)
    const user = await a.then((res)=>{return res[0]})
    if(user===null){
        return done(null,false,{massage:"now user with that username"})
    }
    try{
        if(await bcrypt.compare(password,user.password))
        {
            return done(null,user,{massage:`hay thare ${user.username}`})
        }else{
            return done(null,false,{massage:"rong passoword"})

        }
    }catch (e){
        return done(e)
    }
}))
passport.serializeUser((user,done)=>done(null,user))
passport.deserializeUser((user,done)=>done(null, user))
 
    
//midelware 
const cors = require('cors');
const bodyParser = require('body-parser');
//db
const mongo = require('mongoose')
const Userdb = require("./dataBase/userDb")
const Admindb = require("./dataBase/admins")
const db = clint.db()
//incription
const bcrypt = require("bcryptjs");
const { json } = require('body-parser');

//creat app
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(cookieParser("1234"))
const port = 3030;
http.listen(process.env.PORT || port, listening);
app.use(session({
    secret : "$2a$10$lPKs4fQWZermy1oq061FjeKnYGk8X448w3vhCzOCQSlWQyQHYGTPa",
    resave : false,
    saveUninitialized : false
}),passport.initialize(),passport.session(),flash())
//creating session handler 
const {v4 :uuidV4 } = require("uuid") 

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(express.static(__dirname + '/views'));
app.use("/views", express.static("views"))

//is the user in a session ?
function ensureAuthenticated (req, res, next){
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/logIn') // if not auth
  }

  function forwardAuthenticated (req, res, next){
    if (!req.isAuthenticated()) {
      return next()
    }
    res.redirect('/home');  // if auth    
  }


//get routs
app.get("/",(req,res)=>{
    res.redirect("logIn")
})

app.get('/logIn',forwardAuthenticated,(req, res) => {
        res.render('../Views/logIN/sign')
    })

//post routs
app.post("/signIN",passport.authenticate('local'),async(req,res)=>{
        res.redirect("/home/")
})
app.get("/home/",ensureAuthenticated,(req,res)=>{
    const user = req.session.passport.user
    if(user.hasOwnProperty("adminID")){
        res.redirect("/admin/")
    }else{
        res.redirect("/user/")
    }

})


app.post("/SginUp", async(req, res) => {
    const users =  db.collection("user") 
    console.log(users)
    const Xuser =await db.collection("user").findOne({username : `${req.body.username}`})
    if(Xuser){res.redirect("/logIn")}else{
    const hashPass = await bcrypt.hash(req.body.password ,10)
    let i = await users.count()+2021
    const user = {
        username : req.body.username,
        password : hashPass ,
        userID : i,
        Uc : req.body.Uc,
        phone : req.body.phone,
        instId : "2025"
    }
    try { 
        console.log(user)
         await users.insertOne(user)  
        console.log(`user creted successfuly :`)
        res.redirect("/logIN")
    } catch (error) {
        console.log(error)
        return res.json({status:'error'})
    }}
})
app.post("/AdminSginUp", async(req, res) => {
    const instructors = db.collection("instructors")
    const xinst =await db.collection("instructors").findOne({username : `${req.body.username}`})
    if(xinst){res.redirect("/logIn")}else{
    const hashPass = await bcrypt.hash(req.body.password ,10)
    let  i = await instructors.count() +2021
    const instructor = {
        username : req.body.username,
        adminID : i,
        password : hashPass ,
        Ua : req.body.Ua,
        }
    
    try { 
         await instructors.insertOne(instructor)  
        console.log(`admin creted successfuly :`)
        res.redirect("/logIn")
    } catch (error) {
        console.log(error)
        return res.json({status:'error'})
    }}}
)

//user routs 
app.get('/user/' ,(req, res) => {
    const username =  req.session.passport.user.username
    const id = req.session.passport.user.userID
    res.render('user/user',{username:req.session.passport.user.usernam , userID : req.session.passport.user.userID})
});
app.get('/user/live-class',async (req, res) => {
    const instId = req.session.passport.user.instId
    console.log(instId)
    const room = await db.collection("classRoom").findOne({InstId : `${instId}`})
    const roomId = room.roomId
    console.log(roomId)
    io.on('connection', socket => {
        socket.on('joinRoom', ({ username, room }) => {
          const user = userJoin(socket.id, username, room);
            var botName = "ChatBot"
          socket.join(user.room);
      
          // Welcome current user
          socket.emit('message', formatMessage("ChatBot", 'Welcome to ChatCord!'));
      
          // Broadcast when a user connects
          socket.broadcast
            .to(user.room)
            .emit(
              'message',
              formatMessage("ChatBot", `${user.username} has joined the chat`)
            );
      
          // Send users and room info
          io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
          });
        });
      
        // Listen for chatMessage
        socket.on('chatMessage', msg => {
          const user = getCurrentUser(socket.id);
      
          io.to(user.room).emit('message', formatMessage(user.username, msg));
        });
      
        // Runs when client disconnects
        socket.on('disconnect', () => {
          const user = userLeave(socket.id);
      
          if (user) {
            io.to(user.room).emit(
              'message',
              formatMessage('ChatBot', `${user.username} has left the chat`)
            );
      
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
              room: user.room,
              users: getRoomUsers(user.room)
            });
          }
        });
      });
    res.render('user/livestreamuser',{roomId,username:req.session.passport.user.username , userID : req.session.passport.user.userID})
});
//all class rout 
app.get('/user/class', (req, res) => {
        res.render('class/index',{username:req.session.passport.user.usernam , userID : req.session.passport.user.userID})
    })
//ongoing class
app.get('/user/profile', (req, res) => {
    res.render("class/userprof",{username:req.session.passport.user.usernam , userID : req.session.passport.user.userID})
})
app.get("/user/mangeCourse",(req,res)=>{
    res.render("class/mangstd",{username:req.session.passport.user.usernam , userID : req.session.passport.user.userID})
})
app.get("/logOut",(req,res)=>{
    req.logout()
    res.redirect('/')
})

//admin routs

app.get("/admin/", (req,res)=>{
    res.render("admin/admin",{username:req.session.passport.user.username , userID : req.session.passport.user.adminID})
})

app.get('/admin/manage-class', (req, res) => {
    res.render('admin/managclass',{username:req.session.passport.user.username , userID : req.session.passport.user.adminID})
});
app.get("/admin/live-class/",async(req,res)=>{
    // chat socket 
    const roomId = Math.floor(Math.random() * 5000) + 1000
    const instId = req.session.passport.user.adminID
    newClassRoom ={
        "roomId" : `${roomId}` 
        , "InstId" : `${instId}`
    }
    await db.collection("classRoom").replaceOne({InstId:`${instId}`},newClassRoom)
    
    io.on('connection', socket => {
        socket.on('joinRoom', ({ username, room }) => {
          const user = userJoin(socket.id, username, room);
            var botName = "ChatBot"
          socket.join(user.room);
      
          // Welcome current user
          socket.emit('message', formatMessage("ChatBot", 'Welcome to ChatCord!'));
      
          // Broadcast when a user connects
          socket.broadcast
            .to(user.room)
            .emit(
              'message',
              formatMessage("ChatBot", `${user.username} has joined the chat`)
            );
      
          // Send users and room info
          io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
          });
        });
      
        // Listen for chatMessage
        socket.on('chatMessage', msg => {
          const user = getCurrentUser(socket.id);
      
          io.to(user.room).emit('message', formatMessage(user.username, msg));
        });
      
        // Runs when client disconnects
        socket.on('disconnect', () => {
          const user = userLeave(socket.id);
      
          if (user) {
            io.to(user.room).emit(
              'message',
              formatMessage("ChatBot", `${user.username} has left the chat`)
            );
      
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
              room: user.room,
              users: getRoomUsers(user.room)
            });
          }
        });
      });
    res.render("admin/livestream",{roomId,instId,username:req.session.passport.user.username , userID : req.session.passport.user.adminID})
})
app.get("/admin/mange-courses", async(req,res)=>{
    const inst = await db.collection("instructors").findOne({username:`${req.session.passport.user.username}`})
    const classDb = inst.class
    res.render('admin/managecours',{classDb,username:req.session.passport.user.username , userID : req.session.passport.user.adminID})
})
app.get("/admin/manage-student", async(req,res)=>{
    const cl = await db.collection("class").findOne({username:`${req.session.passport.user.username}`})
    console.log(cl)
    const stuArr = cl.stu
    const newStu = {
        classID : `${Math.floor(Math.random() * 5000) + 1000}`,
        userName : req.body.stuName,
    }
    res.render("admin/managestudent",{stuArr,cl,username:req.session.passport.user.username , userID : req.session.passport.user.adminID})
    
})
app.post("/addClass",async(req,res)=>{   
    const oldInst = await db.collection("instructors").findOne({username:`${req.session.passport.user.username}`})
    const classdb = oldInst.class
    //console.log(oldInst)
    const newClass = {
        classID : `${Math.floor(Math.random() * 5000) + 1000}`,
        className : req.body.className,
        classTime : req.body.time
    }
    const index = classdb.length + 1
    oldInst.class[`${index}`] = newClass
    await db.collection("instructors").replaceOne({username:req.session.passport.user.username},oldInst)
    res.redirect('admin/mange-courses')
})
app.post("/removeClass", async(req,res)=>{
    const oldInst = await db.collection("instructors").findOne({username:`${req.session.passport.user.username}`})
    const classdb = oldInst.class
    const deleteClass = req.body.className
  
    for(let i = 0 ;i <classdb.length;i++)
    {   
        console.log("1")
        if(classdb[i].className === `${deleteClass}`){  
            var dClass = classdb[i]
            console.log("2")
            break
        }
    }
    function arrayRemove(arr, value) { 
        return arr.filter(function(ele){ 
            return ele != value; 
        });
    }
    var result = arrayRemove(classdb, dClass);
    oldInst.class = result
    await db.collection("instructors").replaceOne({username:req.session.passport.user.username},oldInst)
    res.redirect('admin/mange-courses')
})
    
app.get("/admin/profile",(req,res)=>{
    res.render('admin/adminprof',{username:req.session.passport.user.username , userID : req.session.passport.user.adminID})
})

//video shat 

app.post("/consumer", async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    senderStream.getTracks().forEach(track => peer.addTrack(track, senderStream));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }

    res.json(payload);
});

app.post('/broadcast', async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    peer.ontrack = (e) => handleTrackEvent(e, peer);
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }

    res.json(payload);
});

function handleTrackEvent(e, peer) {
    senderStream = e.streams[0];
};




async function connection() {
    try {
        await clint.connect();
        const db = clint.db()
        const users = db.collection("users")
        console.log("conected to mongos")
        return users
    } catch (e) {
        console.log(e)
    }
}

const users = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}
function formatMessage(username, text) {
    return {
      username,
      text,
      time: momment().format('h:mm a')
    };
  }
//setup server

function listening() {
    console.log(`server running on http://localhost:${port}`)
}