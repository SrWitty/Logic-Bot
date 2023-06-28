const { model, Schema } = require("mongoose");

let starboardschema = new Schema({
    Guild: String,
    Channel: String,
    Count: Number,
    SentMessages: Array,
    BanUser: Array
})

module.exports = model("starboardschema", starboardschema);