//jshint esversion: 6
let projectData = {}
let adminL = ['123']
    // Require Express to run server and routes
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const faceApi = require('face-api.js')
const app = express();
//creat app
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('view'));
app.use(cors());

//setup server
const port = 8000;

//const server = app.listen(port, listening);

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
app.post('/login', (req, res) => {
    req.body.user_name
});