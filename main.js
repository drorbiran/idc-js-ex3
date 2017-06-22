var express = require("express");
var path = require('path');
var bodyParser = require('body-parser');

var app = express();


app.use('/public',express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//listen on port 3000
app.listen(3000,function(){
   console.log("listening on port 3000");
});

//All events are going to be stored in here
var events = [
    {
        name: "IDC milioniars event",
        time: "5/7/17 18:00",
        location: "A110",
        food: "drinks and pizza",
        img: "http://s.eatthis-cdn.com/media/images/ext/842849976/greasy-fast-food.jpg",
        id: "0"
    },
    {
        name: "name test",
        time: "5/7/17 18:00",
        location: "where test",
        food: "bla ble drinks and pizza",
        img: "http://s.eatthis-cdn.com/media/images/ext/842849976/greasy-fast-food.jpg",
        id: "1"
    }
];

function Event(name, time, location,food,img) {
    this.name = name;
    this.time = time;
    this.location = location;
    this.food = food;
    this.img = img;
    this.id = guid();
}

//All users
var users = [
    {
        username : "admin",
        password: "1234"
    }
];

//add user/password to the user-list
app.post("/register/:username/:password",function(req,res,next){
    let username = req.params.username;
    let password = req.params.password;
    console.log("username = " + username);
    console.log("password = " + password);
    let userExist = false;
    for(i = 0; i < users.length; i++){
        if (users[i].username === username){
            userExist = true;
            break;
        }
    }
    if (userExist){
        console.log("user exists");
        res.sendStatus(500);
    } else {
        console.log("user does not exists");
        users.push({username: username, password: password});
        res.sendStatus(200);
    }
});

//login an go to the events page
app.post("/login/:username/:password",function(req,res,next){
    let username = req.params.username;
    let password = req.params.password;
    console.log("username = " + username);
    console.log("password = " + password);
    let founduser = false;
    for(i = 0; i < users.length; i++){
        if ((users[i].username === username) && (users[i].password === password)){
            founduser = true;
            console.log("user found");
            res.sendStatus(200);
            break;
        }
    }
    if (!founduser){
        console.log("user or password where not found");
        res.sendStatus(500);
    }
});


app.get("/events", function(req,res){
    console.log("here");
    res.render("events", {events: events});
});


//returns the item with the right id or 404 if no such an item
app.get("/item/:id", function(req,res,next){
    var id = req.params.id;
    console.log("id to return =" + id);
    let found = false;
    for(i = 0; i < events.length; i++) {
        var event = events[i];
        if(event.id === id) {
            found = true;
            res.send(event);
            break;
        }
    }
    if (!found){
        next();
    }
});

// delete the item with the right id or 404 if no such an item
app.delete("/item/:id",function(req,res,next){
    var id = req.params.id;
    console.log("id to delete =" + id);
    let found = false;
    for(i = 0; i < events.length; i++) {
        var event = events[i];
        if(event.id == id) {
            found = true;
            events.splice(i, 1);
            res.send("deleted event id " + id);
            break;
        }
    }
    if (!found){
        next();
    }
});

//returns all the items as an array
app.get("/items",function(req,res,next){
    res.send(events);
});

//upload home page
app.get("/public/hello.html", function(req,res,next){
    res.render("hello");
})

// overwrite the properties values of the item with the same id or 404 if no such an item
app.post("/item/", function(req,res){
    var data = req.body;
    data.id = guid();
    console.log(data);
    events.push(data);
    res.send("cool");
});

//upload home page
app.get("/", function(req,res,next){
    res.render("hello");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.send(err);
});

//create guid
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}