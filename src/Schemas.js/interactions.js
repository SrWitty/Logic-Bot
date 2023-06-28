const { model, Schema } = require('mongoose');

let interactions = new Schema({
    User: String,
    Hug: Number,
    HugGive: Number,
    Slap: Number,
    SlapGive: Number,
    Fail: Number,
    Kill: Number,
    KillGive: Number,
    Err: Number,
    Kiss: Number,
    KissGive: Number,
    Yell: Number,
    YellGive: Number
});

module.exports = model('interactions', interactions);