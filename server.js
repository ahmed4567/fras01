if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config
}
//jshint esversion: 6
let projectData = {}
    // Require Express to run server and routes
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const faceApi = require('face-api.js')
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@cluster0.vjlte.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(() => console.log("conected to mongoos"))
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});
/*
const mongos = require('mongoose')
mongos.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})
const db = mongos.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("conected to mongoos"))
*/

const app = express();
//creat app
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('view'));
app.use(cors());

//setup server
const port = 3030;

const server = app.listen(port, listening);

function listening() {
    console.log(`server running on http://localhost:${port}`)
}

//routs get
app.get('/', (req, res) => {
        res.render(__dirname + '/view/index.ejs')
            // res.sendFile(__dirname + '/view/Login.html')
    })
    //app.post('/', (req, res) => {})

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/view/Home.html')
});
app.get('/manage-class', (req, res) => {
    res.sendFile(__dirname + '/view/manage-class.html')
});
app.get('/manage-student', (req, res) => {
    res.sendFile(__dirname + '/view/manage-student.html')
});
app.get('/going-class', (req, res) => {
    res.sendFile(__dirname + '/view/going-class.html')
});
//routs post
app.post('/signIN', (req, res) => {
    userEntry = {
        userName: req.body.user_name,
        pass: req.body.password
    }
    projectData = userEntry
    console.log(`sign in data =`)
    console.log(projectData)

    projectData = {}
});
app.post("/signUP", (req, res) => {
    newEntry = {
        stuID: req.body.stuID,
        password: req.body.password,
        Ua: req.body.Ua,
        adminCode: req.body.adminCode,
    }
    projectData = newEntry
    console.log(`signUP data =`)
    console.log(projectData)
    projectData = {}
})