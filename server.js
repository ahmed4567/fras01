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

const server = app.listen(port, listening);

function listening() {
    console.log(`server running on http://localhost:${port}`)
}

//routs 
app.get('/all', sendData);
app.get('/', (req, res) => {
        res.sendFile(__dirname + '/view/Login.html')
    })
    //app.post('/', (req, res) => {})
app.post('/', addData);

//get f 
itContain = (i, list) => {
    list.forEach(element => {
        if (element === i) {
            return true
        }
    })
    return false
}

function sendData(request, response) {
    response.send(projectData);
    console.log(projectData)
}


function addData(req, res) {
    newEntry = {
        stuID: req.body.stuID,
        UA: req.body.Ua,
        password: req.body.password,
        adminCode: req.body.adminCode
    }
    if (itContain(newEntry.adminCode, adminL)) {
        projectData = newEntry
        console.log(projectData)
    } else {
        console.log(`error${newEntry.adminCode}/=${adminL[0]}`)
    }


}