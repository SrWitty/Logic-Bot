const { model, Schema } = require('mongoose');
 
let autopublish = new Schema ({
    Guild: String,
    Channel: Array,
})
 
module.exports = model('autopublish', autopublish);