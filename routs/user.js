const expres = require("express")
const router = expres.Router()
const mongo = require('mongoose')
const mongodb = require('mongodb')

router.get('/', (req, res) => {
    res.render('user/Home.ejs',)
});

router.get('/faceTraning', (req, res) => {
    res.render('user/face.ejs')
});
router.get('/joinClass', (req, res) => {
    res.render('user/joinClass.ejs')
});
const classdb = require("../dataBase/classdb")

//all class rout 
router.get('/class', (req, res) => {
        res.render('class/index')
    })
    //new class routs 
router.get('/new', (req, res) => {
    res.render("class/new", { class: new classdb() })
})

router.post('/class', (req, res) => {
        res.send("create")
    })
    //ongoing class
router.get('/onGoing', (req, res) => {
    res.render("class/ongoing")
})

module.exports = router