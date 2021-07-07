if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config
}

//db set up 
const Mongo = require('mongoose');
const MongoClient = require("mongodb").MongoClient
const uri = "mongodb://127.0.0.1:27017/";
const clint = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
connection()

// Require 
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const momment = require('moment')
const webrtc = require("wrtc");
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
//file upload 
const filePond = require("filepond")
// upload storeg




let senderStream;

//sokit io
const io = require("socket.io")(http);


//authinticatio 
const session = require("express-session")
const flash = require("express-flash")
const LocalStorage = require("passport-local")
const passport = require("passport")
const cookieParser = require('cookie-parser')
const getUserByID = async (user) => {
  const db = clint.db()
  const instructor = await db.collection("instructors").findOne({ adminID: `${user.body.adminID}` })
  const stu = await db.collection("user").findOne({ password: `${user.userID}` })
  if (stu === null) {
    return [instructor]
  } else {
    return [stu]
  }
}
const getUserByUsername = async (user) => {
  const db = clint.db()
  const instructor = await db.collection("instructors").findOne({ username: `${user}` })
  const stu = await db.collection("user").findOne({ username: `${user}` })
  const admin = await db.collection("admin").findOne({ username: `${user}` })
  if (stu === null && admin === null) {
    return [instructor]
  } else if (admin === null && instructor === null) {
    return [stu]
  } else if (instructor === null && stu === null) {
    return [admin]
  }
}

passport.use(new LocalStorage(async (username, password, done) => {
  const a = getUserByUsername(username)
  const user = await a.then((res) => { return res[0] })
  if (user === null) {
    return done(null, false, { massage: "now user with that username" })
  }
  try {
    if (await bcrypt.compare(password, user.password)) {
      return done(null, user, { massage: `hay thare ${user.username}` })
    } else {
      return done(null, false, { massage: "rong passoword" })
    }
  } catch (e) {
    return done(e)
  }
}))
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))


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
  secret: "$2a$10$lPKs4fQWZermy1oq061FjeKnYGk8X448w3vhCzOCQSlWQyQHYGTPa",
  resave: false,
  saveUninitialized: false
}), passport.initialize(), passport.session(), flash())
//creating session handler 
const { v4: uuidV4 } = require("uuid")

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(express.static(__dirname + '/views'));
app.use("views", express.static("views"))

//is the user in a session ?
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/logIn') // if not auth
}

function forwardAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  res.redirect('/home');  // if auth    
}


//get routs
app.get("/", (req, res) => {
  res.redirect("logIn")
})

app.get('/logIn', forwardAuthenticated, (req, res) => {
  res.render('../Views/logIN/sign')
})

//post routs
app.post("/signIN", passport.authenticate('local'), async (req, res) => {

  res.redirect("/home/")
})
app.get("/home/", ensureAuthenticated, (req, res) => {
  const user = req.session.passport.user
  if (user.hasOwnProperty("superId")) {
    res.redirect("/newAdmin/mangment")
  } else if (user.hasOwnProperty("adminID")) {
    res.redirect("/admin/")
  } else if (user.hasOwnProperty("userID")) {
    res.redirect("/user/")
  }

})


app.post("/SginUp", async (req, res) => {
  const users = db.collection("user")
  console.log(users)
  const Xuser = await db.collection("user").findOne({ username: `${req.body.username}` })
  if (Xuser) { res.redirect("/logIn") } else {
    const hashPass = await bcrypt.hash(req.body.password, 10)
    let i = await users.count() + 2021
    const user = {
      username: req.body.username,
      password: hashPass,
      userID: `${i}`,
      Uc: req.body.email,
      phone: req.body.phone,
      classList: [],
      fuc: req.body.fuc

    }
    try {
      console.log(user)
      await users.insertOne(user)
      console.log(`user creted successfuly :`)
      res.redirect("/logIN")
    } catch (error) {
      console.log(error)
      return res.json({ status: 'error' })
    }
  }
})
app.post("/instractorSginUp", async (req, res) => {
  const watinInstD = await db.collection("watinInst").findOne({ listId: "5050" })
  console.log(watinInstD)
  const watinInstList = watinInstD.watingList
  const xinst = await db.collection("instructors").findOne({ username: `${req.body.username}` })
  if (xinst) { res.redirect("/logIn") } else {
    const hashPass = await bcrypt.hash(req.body.password, 10)
    let i = Math.floor(Math.random() * 5000) + 1000
    arr = []
    const instructor = {
      username: req.body.username,
      adminID: `${i}`,
      password: hashPass,
      email: req.body.email,
      phone: req.body.phone,
      class: arr,
      stu: arr
    }
    console.log(watinInstList)
    const index = watinInstList.length

    try {
      watinInstD.watingList[`${index}`] = instructor
      await db.collection("watinInst").replaceOne({ listId: "5050" }, watinInstD)
      console.log(`admin creted successfuly :`)
      res.redirect("/logIn")
    } catch (error) {
      console.log(error)
      return res.json({ status: 'error' })
    }
  }
}
)


//user routs 
app.get('/user/', async (req, res) => {
  const user = req.session.passport.user
  const userD = await db.collection("user").findOne({ username: `${user.username}` })
  const classList = userD.classList
  res.render('user/user', { classList, username: req.session.passport.user.username, userID: req.session.passport.user.userID })
});
app.get('/user/live-class', async (req, res) => {
  const room = await db.collection("classRoom").findOne({ roomL: `101010` })
  const rooms = room.rooms
  console.log(rooms)
  curentRomm = 0
    var curentRomm = rooms.roomId

  io.on('connection', socket => {
    });
    
   const roomId =curentRomm

  res.render('user/livestreamuser', { roomId, username: req.session.passport.user.username, userID: req.session.passport.user.userID })
});

app.get('/user/profile', async (req, res) => {
  const user = req.session.passport.user
  const userClass = await db.collection("user").findOne({ userID: `${user.userID}` })
  const ClassList = userClass.classList
  const userD = await db.collection("stuClass").findOne({ fuc: `${user.fuc}` })
  const classList = userD.class
  res.render("user/userprof", { classList, ClassList, username: req.session.passport.user.username, userID: req.session.passport.user.userID })
})
app.get("/user/mangeCourse", async (req, res) => {
  const user = req.session.passport.user
  const userClass = await db.collection("user").findOne({ userID: `${user.userID}` })
  const ClassList = userClass.classList
  const userD = await db.collection("stuClass").findOne({ fuc: `${user.fuc}` })
  const classList = userD.class
  res.render("user/mangstd", { ClassList, classList, username: req.session.passport.user.usernam, userID: req.session.passport.user.userID })
})
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

//user post 

app.post("/stuJoinReq", async (req, res) => {
  const className = req.body.className
  const stuId = req.session.passport.user.userID
  const user = req.session.passport.user

  const watingClass = await db.collection("watinClass").findOne({ wateId: "3020" })
  const watingClassList = watingClass.watinList
  const userD = await db.collection(`user`).findOne({ userID: `${stuId}` })
  const stuClassList = userD.classList
  const classD = await db.collection("stuClass").findOne({ fuc: `${user.fuc}` })
  const classList = classD.class
  for (let i = 0; i < classList.length; i++) {
    if (classList[i].className === className) {
      var thisId = classList[i].intId
      console.log(thisId)
    }
  }
  const newClassReq = {
    className: `${className}`,
    stuId: `${stuId}`,
    intID: `${thisId}`,
    classStats: `Witting`,
    stuname: `${req.session.passport.user.username}`
  }
  const index = stuClassList.length
  const index2 = watingClassList.length

  watingClass.watinList[`${index2}`] = newClassReq
  userD.classList[`${index}`] = newClassReq
  await db.collection("watinClass").replaceOne({ wateId: "3020" }, watingClass)
  await db.collection('user').replaceOne({ userID: `${stuId}` }, userD)
  res.redirect("/user/mangeCourse")
})
app.post("/leaveClass", async (req, res) => {
  let user = req.session.passport.user
  let stuId = req.session.passport.user.userID
  let deleteClass = req.body.className
  const watindb = await db.collection("watinClass").findOne({ wateId: "3020" })
  const watinStu = watindb.watinList
  const classD = await db.collection("stuClass").findOne({ fuc: `${user.fuc}` })
  const classList = classD.class
  for (let i = 0; i < classList.length; i++) {
    if (classList[i].className === deleteClass) {
      var adId = classList[i].intId
      console.log(adId)
    }
  }
  let inst = await db.collection("instructors").findOne({ adminID: `${adId}` })
  let stuList = inst.stu
  let stu = await db.collection("user").findOne({ userID: `${stuId}` })
  const stuClassList = stu.classList
  for (let i = 0; i < stuClassList.length; i++) {
    console.log("1")
    if (stuClassList[i] === null) {
      continue
    } else {
      if (stuClassList[i].className === `${deleteClass}`) {
        var dClass = stuClassList[i]
        console.log("2")
        var result = arrayRemove(stuClassList, dClass)
        break
      }
    }
  }
  for (let i = 0; i < stuList.length; i++) {
    console.log("1")
    if (stuClassList[i] === null) {
      continue
    } else {
      if (stuList[i].className === `${deleteClass}`) {
        var dClass = stuList[i]
        console.log("2")
        var result2 = arrayRemove(stuList, dClass)
        break
      }
    }
  }
  for (let i = 0; i < watinStu.length; i++) {
    if (watinStu[i] === null) {
      continue
    } else {
      if (watinStu[i].className === `${deleteClass}`) {
        var dClass = watinStu[i]
        console.log("2")
        var result3 = arrayRemove(watinStu, dClass)
        break
      }
    }
  }
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  stu.classList = result
  watindb.watinList = result3
  for (let i = 0; i < stuClassList.length; i++) {
    if (stuClassList[i].classStats === "ok" && stuClassList[i].className === deleteClass) {
      console.log(stuClassList[i].classStats, stuClassList[i].className)
      inst.stu = result2
      await db.collection("instructors").replaceOne({ adminID: `${adId}` }, inst)
      break
    } else if (stuClassList[i].classStats === "Witting" && stuClassList[i].className === deleteClass) {
      await db.collection("watinClass").replaceOne({ wateId: "3020" }, watindb)
    }
  }
  await db.collection("user").replaceOne({ userID: `${stuId}` }, stu)

})

//new admin
app.get("/newAdmin", async (req, res) => {
  const username = req.session.passport.user.username
  const adminsD = await db.collection("adminList").findOne({ adminLId: "6060" })
  const adminlist = adminsD.adminList
  const instD = await db.collection("instList").findOne({ instLId: "7070" })
  const instList = instD.instList
  const instWatiClass = await db.collection("InstWatList").findOne({ lestId: "7878" })
  const classWatin = instWatiClass.wtinClassl
  res.render("newAdmin/instractorad", { classWatin, username, adminlist, instList })
})
app.get("/newAdmin/mangment", async (req, res) => {
  const username = req.session.passport.user.username
  const adminsD = await db.collection("adminList").findOne({ adminLId: "6060" })
  const adminlist = adminsD.adminList
  const instD = await db.collection("instList").findOne({ instLId: "7070" })
  const instList = instD.instList
  const instWatiClass = await db.collection("InstWatList").findOne({ lestId: "7878" })
  const classWatin = instWatiClass.wtinClassl

  const watinInst = await db.collection("watinInst").findOne({ listId: "5050" })
  const watingList = watinInst.watingList

  res.render(`newAdmin/admins`, { username, watingList, adminlist, instList, classWatin })

})
app.post("/regesteNewAdmin", async (req, res) => {
  const users = db.collection("admin")
  console.log(users)
  const Xuser = await db.collection("admin").findOne({ username: `${req.body.username}` })
  if (Xuser) { res.redirect("/logIn") } else {
    const hashPass = await bcrypt.hash(req.body.password, 10)
    let i = Math.floor(Math.random() * 5000) + 1000
    const user = {
      username: req.body.username,
      password: hashPass,
      superId: `${i}`,
      email: req.body.email,
      phone: req.body.phone,
    }
    try {
      console.log(user)
      await users.insertOne(user)
      console.log(`user creted successfuly :`)
      res.redirect("/newAdmin/mangment")
    } catch (error) {
      console.log(error)
      return res.json({ status: 'error' })
    }
  }

})
//admin routs

app.get("/admin/", async (req, res) => {
  const inst = await db.collection("instructors").findOne({ username: `${req.session.passport.user.username}` })
  const classDb = inst.class
  res.render("admin/admin", { classDb, username: req.session.passport.user.username, userID: req.session.passport.user.adminID })
})

app.get('/admin/manage-class', (req, res) => {
  res.render('admin/managclass', { username: req.session.passport.user.username, userID: req.session.passport.user.adminID })
});
app.get("/admin/live-class/", async (req, res) => {
  // chat socket 
  const roomId = Math.floor(Math.random() * 5000) + 1000
  const instId = req.session.passport.user.adminID
  const roomD = await db.collection("classRoom").findOne({ roomL: `101010` })
  const rooms = roomD.rooms
  console.log(roomD)
  newClassRoom = {
    "roomId": `${roomId}`
    , "InstId": `${instId}`
  }
  roomD.rooms = newClassRoom
  console.log(roomD)
  await db.collection("classRoom").replaceOne({ roomL: `101010` }, roomD)

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
  res.render("admin/livestream", { roomId, instId, username: req.session.passport.user.username, userID: req.session.passport.user.adminID })
})
app.get("/admin/mange-courses", async (req, res) => {
  const inst = await db.collection("instructors").findOne({ username: `${req.session.passport.user.username}` })
  const classDb = inst.class
  const stuList = inst.stu
  res.render('admin/managecours', { stuList, classDb, username: req.session.passport.user.username, userID: req.session.passport.user.adminID })
})
app.get("/admin/manage-student", async (req, res) => {
  const wtindb = await db.collection("watinClass").findOne({ wateId: `3020` })
  const watinList = wtindb.watinList
  const inst = await db.collection("instructors").findOne({ username: `${req.session.passport.user.username}` })
  const classDb = inst.class
  const stuList = inst.stu
  res.render("admin/managestudent", { watinList, stuList, classDb, username: req.session.passport.user.username, userID: req.session.passport.user.adminID })

})

app.post("/addClass", async (req, res) => {
  let oldInst = await db.collection("InstWatList").findOne({ lestId: `7878` })
  let classdb = oldInst.wtinClassl
  let newClass = {
    classID: `${Math.floor(Math.random() * 5000) + 1000}`,
    className: req.body.className,
    classTime: req.body.time,
    classStart: req.body.dateStart,
    classEnd: req.body.dateEnd,
    classFuc: req.body.classFuc,
    username: req.session.passport.user.username
  }
  const index = classdb.length
  oldInst.wtinClassl[`${index}`] = newClass
  await db.collection("InstWatList").replaceOne({ lestId: '7878' }, oldInst)
  res.redirect('admin/mange-courses')
})
app.post("/addStu", async (req, res) => {
  const stuId = req.body.stuId
  const className = req.body.className
  const intId = req.session.passport.user.adminID
  const inst = await db.collection("instructors").findOne({ adminID: `${intId}` })
  const stuList = inst.stu
  const stu = await db.collection("user").findOne({ userID: `${stuId}` })
  const stuClassList = stu.classList
  const newClass = {
    className: `${className}`,
    intID: `${intId}`,
    classStats: "ok"
  }
  const newStu = {
    className: `${className}`,
    stuId: `${stuId}`,
    stuName: `${stu.username}`
  }
  const index = stuClassList.length
  stu.classList[`${index}`] = newClass
  const index2 = stuList.length
  inst.stu[`${index2}`] = newStu
  const classDb = stuClassList
  await db.collection("instructors").replaceOne({ adminID: `${intId}` }, inst)
  await db.collection("user").replaceOne({ userID: `${stuId}` }, stu)
  res.redirect("/admin/manage-student")
})
app.post("/removeStu", async (req, res) => {
  let stuId = req.body.stuId
  let deleteClass = req.body.className
  console.log(req.body, `"${stuId}"`, deleteClass)
  let intId = req.session.passport.user.adminID
  let inst = await db.collection("instructors").findOne({ adminID: `${intId}` })
  let stuList = inst.stu
  let stu = await db.collection("user").findOne({ userID: `${stuId}` })
  const stuClassList = stu.classList
  for (let i = 0; i < stuClassList.length; i++) {
    console.log("1")
    if (stuClassList[i] === null) {
      continue
    } else {
      if (stuClassList[i].className === `${deleteClass}`) {
        var dClass = stuClassList[i]
        console.log("2")
        var result = arrayRemove(stuClassList, dClass)
        break
      }
    }
  }
  for (let i = 0; i < stuList.length; i++) {
    console.log("1")
    if (stuClassList[i] === null) {
      continue
    } else {
      if (stuList[i].className === `${deleteClass}`) {
        var dClass = stuList[i]
        console.log("2")
        var result2 = arrayRemove(stuList, dClass)
        break
      }
    }
  }
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  console.log(stuClassList, stuList)
  stu.classList = result

  inst.stu = result2
  stuList = result2
  classDb = result
  await db.collection("instructors").replaceOne({ adminID: `${intId}` }, inst)
  await db.collection("user").replaceOne({ userID: `${stuId}` }, stu)
  res.redirect("/admin/manage-student")

})
app.post("/removeClass", async (req, res) => {
  const oldInst = await db.collection("instructors").findOne({ username: `${req.session.passport.user.username}` })
  const classdb = oldInst.class
  const deleteClass = req.body.className
  console.log(deleteClass)
  for (let i = 0; i < classdb.length; i++) {
    console.log("1")
    if (classdb[i] === null) {
      continue
    } else {
      if (classdb[i].className === `${deleteClass}`) {
        var dClass = classdb[i]
        console.log("2")
        var result = arrayRemove(classdb, dClass)
        break
      }
    }
  }
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }
  oldInst.class = result
  await db.collection("instructors").replaceOne({ username: req.session.passport.user.username }, oldInst)
  res.redirect('admin/mange-courses')
})
app.post("/Accepte", async (req, res) => {
  const stuId = req.body.stuId
  const className = req.body.className
  const intId = req.session.passport.user.adminID
  const inst = await db.collection("instructors").findOne({ adminID: `${intId}` })
  const stuList = inst.stu
  const stu = await db.collection("user").findOne({ userID: `${stuId}` })
  const stuClassList = stu.classList
  const classD = await db.collection("stuClass").findOne({ fuc: `${stu.fuc}` })
  const classTabl = classD.class
  for (let i = 0; i < classTabl.length; i++) {
    if (classTabl[i].className === className) {
      var ClassTime = classTabl[i].time
      var ClassSD = classTabl[i].startD
      var classED = classTabl[i].endD
    }
  }
  const newClass = {
    className: `${className}`,
    intID: `${intId}`,
    classStats: "ok",
    classStart: `${ClassTime}`,
    classSD: `${ClassSD}`,
    classED: `${classED}`
  }

  const newStu = {
    className: `${className}`,
    stuId: `${stuId}`,
    stuName: `${stu.username}`
  }


  const index2 = stuList.length
  inst.stu[`${index2}`] = newStu
  const classDb = stuClassList
  await db.collection("instructors").replaceOne({ adminID: `${intId}` }, inst)
  await db.collection("user").updateOne(
    { "classList.className": `${className}` },
    {
      "$set": {
        "classList.$.classStats": "ok"
      }
    })
  let user = req.session.passport.user
  const watindb = await db.collection("watinClass").findOne({ wateId: "3020" })
  const watinStu = watindb.watinList

  for (let i = 0; i < watinStu.length; i++) {
    if (watinStu[i] === null) {
      continue
    } else {
      if (watinStu[i].className === `${className}`) {
        var dClass = watinStu[i]
        console.log("2")
        var result3 = arrayRemove(watinStu, dClass)
        break
      }
    }
  }
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  watindb.watinList = result3

  await db.collection("watinClass").replaceOne({ wateId: "3020" }, watindb)



  res.redirect("/admin/manage-student")

})
app.post("/reject", async (req, res) => {

  const stuId = req.body.stuId
  const className = req.body.className
  const intId = req.session.passport.user.adminID


  const stu = await db.collection("user").findOne({ userID: `${stuId}` })
  const stuClassList = stu.classList

  for (let i = 0; i < stuClassList.length; i++) {
    console.log("1")
    if (stuClassList[i] === null) {
      continue
    } else {
      if (stuClassList[i].className === `${className}`) {
        var dClass = stuClassList[i]
        console.log("2")
        var result = arrayRemove(stuClassList, dClass)
        break
      }
    }
  }
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }
  stu.classList = result
  await db.collection("user").replaceOne({ userID: `${stuId}` }, stu)


  const watindb = await db.collection("watinClass").findOne({ wateId: "3020" })
  const watinStu = watindb.watinList
  for (let i = 0; i < watinStu.length; i++) {
    if (watinStu[i] === null) {
      continue
    } else {
      if (watinStu[i].className === `${className}`) {
        var dClass = watinStu[i]
        console.log("2")
        var result3 = arrayRemove(watinStu, dClass)
        break
      }
    }
  }
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  stu.classList = result
  watindb.watinList = result3
  for (let i = 0; i < stuClassList.length; i++) {
    if (stuClassList[i].classStats === "ok" && stuClassList[i].className === className) {
      console.log(stuClassList[i].classStats, stuClassList[i].className)
      inst.stu = result2
      await db.collection("instructors").replaceOne({ adminID: `${adId}` }, inst)
      break
    } else if (stuClassList[i].classStats === "Witting" && stuClassList[i].className === className) {
      await db.collection("watinClass").replaceOne({ wateId: "3020" }, watindb)
    }
  }
})


app.get("/admin/profile", async (req, res) => {
  res.render('admin/adminprof', { username: req.session.passport.user.username, userID: req.session.passport.user.adminID })

})
app.post("/admin/profile", async (req, res) => {
  const user = req.session.passport.user
  const newBass = req.body.password
  const confBass = req.body.passwordCon
  const oldPass = req.body.oldPassword
  const newHashPass = await bcrypt.hash(req.body.password, 10)

  if (await bcrypt.compare(oldPass, user.password) && !await bcrypt.compare(newBass, user.password)) {

    const newAdminData = {
      username: `${req.body.username}`,
      password: `${newHashPass}`,
      phone: `${req.body.phone}`
    }
    Console.log(newAdminData)
  } else {
  }
  saveCover(newAdminData, req.body.cover)

  console.log(newAdminData)
})

app.post("/AccepteInst", async (req, res) => {
  console.log("treferd")
  const username = req.body.username
  const watindb = await db.collection("watinInst").findOne({ listId: `${5050}` })
  const instlist = watindb.watingList
  for (let i = 0; i < instlist.length; i++) {
    if (instlist[i].username === username) {

      await db.collection("instructors").insertMany([{
        username: `${instlist[i].username}`,
        adminID: `${instlist[i].adminID}`,
        password: `${instlist[i].password}`,
        email: `${instlist[i].email}`,
        phone: `${instlist[i].phone}`,
        class: instlist[i].class,
        stu: instlist[i].stu
      }])
    }
  }
  result3 = 0
  for (let i = 0; i < instlist.length; i++) {
    if (instlist[i] === null) {
      continue
    } else {
      if (instlist[i].username === `${username}`) {
        var dClass = instlist[i]
        console.log("2")
        var result3 = arrayRemove(instlist, dClass)
        break
      }
    }
  }
  console.log(result3)
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  watindb.watingList = result3
  await db.collection("watinInst").replaceOne({ listId: `${5050}` }, watindb)


  res.redirect("/newAdmin/")

})
app.post("/AccepClassInst", async (req, res) => {

  const className = req.body.className
  const watindb = await db.collection("InstWatList").findOne({ lestId: `${7878}` })
  const instlist = watindb.wtinClassl

  const listInst = await db.collection("instructors").findOne({ username: `${req.body.username}` })
  const instClassList = listInst.class
  for (let i = 0; i < instlist.length; i++) {
    if (instlist[i].className === className) {

      let newClass = {
        classID: instlist[i].classID,
        className: instlist[i].className,
        classTime: instlist[i].classTime,
        classStart: instlist[i].classStart,
        classEnd: instlist[i].classEnd,
        classFuc: instlist[i].classFuc
      }
      const fucClass = await db.collection("stuClass").findOne({fuc : `${instlist[i].classFuc}` })
      console.log(newClass)
      const fucClassList = fucClass.class
      const index = instClassList.length
      listInst.class[`${index}`] = newClass
        const index2 = fucClassList.length
        console.log(index2)
        fucClass.class[`${index2}`] = newClass
        await db.collection("stuClass").replaceOne({fuc : `${instlist[i].classFuc}` }, fucClass)
      

      await db.collection("instructors").replaceOne({ username: `${req.body.username}` }, listInst)

    }
  }
  result3 = 0
  for (let i = 0; i < instlist.length; i++) {
    if (instlist[i] === null) {
      continue
    } else {
      if (instlist[i].className === `${className}`) {
        var dClass = instlist[i]
        console.log("2")
        var result3 = arrayRemove(instlist, dClass)
        break
      }
    }
  }
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  watindb.wtinClassl = result3
  await db.collection("InstWatList").replaceOne({ lestId: `${7878}` }, watindb)


  res.redirect("/newAdmin/")

})
app.post("/RClassInst", async (req, res) => {
  console.log("wtf")
  const username = req.body.username
  const watingInstdb = await db.collection("InstWatList").findOne({ lestId: `${7878}` })
  console.log(req.body)
  console.log(watingInstdb)
  const WIL = watingInstdb.wtinClassl
  result3 = 0
  for (let i = 0; i < WIL.length; i++) {
    if (WIL[i] === null) {
      continue
    } else {
      if (WIL[i].username === username) {
        console.log(WIL[i])
        var dClass = WIL[i]
        console.log("2")
        let result3 = arrayRemove(WIL, dClass)
        console.log(result3)
        watingInstdb.wtinClassl = result3
        await db.collection("InstWatList").replaceOne({ lestId: `${7878}` }, watingInstdb)
        break
      }
    }
  }
  console.log(result3)
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }




})
app.post("/RInst", async (req, res) => {
  const username = req.body.username
  const className = req.body.className
  console.log(req.body)
  const watindb = await db.collection("watinInst").findOne({ listId: `${5050}` })
  const instlist = watindb.watingList
  console.log(instlist)
  result3 = 0
  for (let i = 0; i < instlist.length; i++) {
    console.log("tregerd for")

    if (instlist[i] === null) {
      continue
    } else {
      console.log(instlist[i].username, className)
      if (instlist[i].username === className) {
        console.log("tregerd")
        var dClass = instlist[i]
        console.log("2")
        var result3 = arrayRemove(instlist, dClass)
        watindb.watingList = result3
        await db.collection("watinInst").replaceOne({ listId: `${5050}` }, watindb)
        break
      }
    }
  }
  console.log(result3)
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }




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
function checkForMatch(array, propertyToMatch, valueToMatch) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][propertyToMatch] == valueToMatch)
      return true;
  }
  return false;
}
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

function saveCover(cover, coverEncoded) {
  if (coverEncoded === null) return
  const coverDecoded = JSON.parse(coverEncoded)
  if (coverDecoded != null && imageMimeTypes.includes(coverDecoded.type)) {
    cover.coverImage = new Buffer.from(coverDecoded.data, 'base64')
    cover.coverImageType = coverDecoded.type
  }
}

//setup server

function listening() {
  console.log(`server running on http://localhost:${port}`)
}