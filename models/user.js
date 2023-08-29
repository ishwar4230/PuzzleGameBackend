const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
   
    username:String,
    email:String,
    password:String,
    score_time:Number,
    score_move:Number,
});

module.exports = mongoose.model("user", userschema);