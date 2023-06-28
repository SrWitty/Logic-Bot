const { model, Schema } = require('mongoose');

let autoroleschema = new Schema ({
    Guild: String,
    Role: String
})

module.exports = model('autoroleschema', autoroleschema);