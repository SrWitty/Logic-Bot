const { model, Schema } = require('mongoose');

let confessschema = new Schema ({
    Guild: String,
    Channel: String,
    Timeout: Number,
    Logs: String
})

module.exports = model('confessschema', confessschema);