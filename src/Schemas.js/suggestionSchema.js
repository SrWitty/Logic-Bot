const { model, Schema } = require('mongoose');
 
let suggestionSchema = new Schema({
    Guild: String,
    Channel: String
});
 
module.exports = model('suggestionSchema', suggestionSchema);