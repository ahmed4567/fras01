const mongo = require('mongoose')

const instructorsSchema = new mongo.Schema({
    username: {
        type: String,
        requierd: true, 
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

},{collection:"instructors"})


const Model = mongo.model("instructors", instructorsSchema)
module.exports = Model