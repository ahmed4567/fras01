require('dotenv').config()
    //mango setup
const { response } = require('express')
const express = require('express')
const bodyParser = require('body-parser');
const cors = require("cors")
const router = express.Router()
const initBass = require("./passConfig")
const bcrypt = require("bcrypt");
const passport = require('passport');
//initBass(passport)
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


let projectData = []
router.use(express.json())







module.exports = router