

const mongoose = require("mongoose");
const DBkey = "mongodbkey";
module.exports = function(){
    mongoose.connect(DBkey)
    .then(function(){
        console.log("database connected");
    })
    .catch(function(){
        console.log("database connection failed")
    })
}