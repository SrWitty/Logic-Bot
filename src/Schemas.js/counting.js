const { model, Schema } = require('mongoose');

let countschema = new Schema ({
    Guild: String,
    Channel: String,
    Count: Number,
    LastUser: String,
})

module.exports = model('countschema', countschema);