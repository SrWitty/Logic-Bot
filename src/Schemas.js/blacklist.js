const { model, Schema } = require('mongoose');

let blacklist = new Schema ({
    User: String
})

module.exports = model('blacklist', blacklist);