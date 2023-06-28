const { model, Schema } = require("mongoose");

let reactionroles = new Schema({
    Roles: String,
    MessageID: String,
    Emoji: String
})

module.exports = model("reactionroles", reactionroles);