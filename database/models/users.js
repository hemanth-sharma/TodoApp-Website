const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    // profilePic: String,
    userTodo: [String]
});

const userModel = new mongoose.model("user", userSchema);
module.exports = userModel;