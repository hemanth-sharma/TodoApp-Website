// mongodb+srv://cat:<password>@cluster0.irmakxy.mongodb.net/?retryWrites=true&w=majority


const express = require("express");
const fs = require("fs");
const app = express();
const multer = require("multer");
const session = require("express-session");
const cors = require("cors");
const startDb = require("./database/init");
const userModel = require("./database/models/users");
startDb();


app.use(express.static("public"));
// app.use(express.static("uploads"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true})); // this middleware is for handling form data

app.set("view engine", "ejs");
app.set("views", "views");

const upload = multer({dest: "uploads"});

app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))


app.listen(5000, ()=>{
    console.log("Server is listening on port 5000....");
})


// home //
app.route("/").get((req, res)=>{
    console.log("homepage ejs");
    console.log(req.session);
    if(req.session.isLoggedIn){
        res.render("home", {data: "Say me hi", username:"hemant"});
    }
    else{
        res.redirect("/login");
    }
}).post((req, res)=>{
    console.log(req.body);
});

// logout //
app.get("/logout", (req, res)=>{
    req.session.destroy();
	res.redirect("/login");
	console.log("destroyed");
});

// signup //
app.route("/signup").get((req, res)=>{
    console.log("signup ejs");
    res.render("signup", {error: ""});
}).post((req, res)=>{
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        userTodo: []
    }
    saveUser(user, (err)=>{
        if(err){
            res.end("Error while saving the user " + err);
        }
        else{
            res.redirect("/login");
        }
    });
});

// login //
app.route("/login").get((req, res)=>{
    console.log("login ejs");
    res.render("login", {error: ""});
}).post((req, res)=>{
    checkUserLogin(req.body.email, req.body.password, (err, user)=>{
        if(err){
            res.end("error mr." + err);
        }
        else{
            // console.log(user.username, " ", user.email, " ");
            req.session.isLoggedIn = true;
            req.session.username = user.username;
            req.session.email = user.email;
            console.log(req.session.email);
            // res.cookie("userData", {
            //     email: user.email,
            //     username: user.username,
            //     isLoggedIn: true
            // });
            console.log("did it hit this?");
            res.redirect("/");
        }
    });
});

// todo
app.route("/todo").get((req, res)=>{
    // get todos from db and send them to browser
    // call db to get user req.session.email
    // send res.json(user) if it exist
    // else error
    console.log("todo/email", req.session.email);
    getOneUser(req.session.email, function(err, user){
        if(err){
            console.log("error in getTodo");
        }
        else{
            console.log("Check ");
            console.log(req.session);
            // console.log(req.cookies);

            console.log("get/todo = user", user);
            res.json(user[0]);
        }
    });
}).post((req, res)=>{
    // get todo from browser and send them to db
    // call db to get user in req.session.email
    // push todo req.body.task
    // update db
    // console.log("before post/todo", req.session.email);
    getOneUser(req.session.email, (err, user)=>{
        if(err){
            console.log("error in postTodo");
        }
        else{
            console.log("post/todo was made");
            user[0].todo.push(req.body.task);
            // update db
            userModel.updateOne(
                {email: req.session.email},
                {todo: user[0].todo}
            );

        }
    });

})

app.post("/updatetask", (req, res)=>{
    getOneUser(req.session.email, (err, user)=>{
        if(err){
            console.log("error/update");
        }
        else{
            user.todo.splice(req.body.newIndex, 1, newTask);
            // update on db
        }
    })
})

function saveUser(user, callback){
    // check if user email doesn't exist in db
    // save user on db
    // getOneUser()
    // getOneUser(user.email, )
    getOneUser(user.email, (err, x)=>{
        if(err){
            callback("User already exist");
        }
        else{
            if(!x.length){
                userModel.create(user).then(function(){
                    callback(null);
                }).catch(function(){
                    callback("Error in saving user");
                });
            }
            else{
                callback("Uesr already exist");
            }
        }
    });
    
}
function getOneUser(email, callback){
    // get one user, email
    // pass that user to callback
    userModel.find({email: email}).then(function(data){
        console.log("data");
        callback(null, data);
    }).catch(function(err){
        console.log("error")
        callback("user not found", null);
    })
}
function checkUserLogin(email, password, callback){
    // call getOneUser() check password
    // pass the user to callback
    getOneUser(email, (err, user)=>{
        if(err || !user.length){
            callback(err);
        }
        else{
            if(user[0].password === password){
                callback(null, user);
            }
            else{
                callback(err + ", wrong password");
            }
        }
    });
}
// function updateOnDB()  




var options = {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
var prnDt = new Date().toLocaleTimeString('en-us', options);

console.log(prnDt);