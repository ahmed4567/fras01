const mongo = require('mongoose')

const userSchema = new mongo.Schema({
    stuName: {
        type: String,
        requierd: true, 
         
    },
    stuID: { 
        type: String, 
        requierd: true, 
        unique: true 
    },
    stuFaceId:{
        type: String, 
        requierd: false 
    },
    password: { 
        type: String, 
        requierd: true 
    },
    Ua: { 
        type: String, 
        requierd: true, 
        
    },
    adminCode: { 
        type: String, 
        requierd: true, 
         
    }

},{collection:"newUserS"})


const Model = mongo.model("user", userSchema,)
module.exports = Model