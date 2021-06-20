const mango = require("mongoose")

const classSchema = new mango.Schema({
    name: {
        type: String,
        required: true
    },
    classID: {
        type: String,
        required: true
    }
})
module.exports = mango.model('class', classSchema)