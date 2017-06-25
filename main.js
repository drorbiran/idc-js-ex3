var express = require("express");
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');


var app = express();


app.use('/public',express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());


//listen on port 3000
app.listen(3000,function(){
   console.log("listening on port 3000");
});

//All events are going to be stored in here
var events = [
    {
        name: "IDC milioniars event",
        time: "Fri, 23 Jun 2017 16:56:03 GMT",
        location: "CB102",
        food: "donates",
        img: "http://www.adeleruns.com/wp-content/uploads/2017/05/Angel-Food-High-Res-6766.jpeg",
        id: "0"
    },
    {
        name: "name test",
        time: "Sun, 5 Jun 2017 18:00:03 GMT",
        location: "where test",
        food: "drinks and pizza",
        img: "http://s.eatthis-cdn.com/media/images/ext/842849976/greasy-fast-food.jpg",
        id: "1"
    }
];

function Event(name, location, food, img) {
    this.name = name;
    this.location = location;
    this.food = food;
    this.img = img;
}

//All users
var users = [
    {
        uid: "1",
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
        console.log("user already exists");
        res.sendStatus(500);
    } else {
        console.log("User was successfully registered");
        users.push({username: username, password: password});
        res.sendStatus(200);
    }
});

//login an go to the events page
app.post("/login/:username/:password",function(req,res,next){
    let username = req.params.username;
    let password = req.params.password;
    let foundUser = false;
    for(i = 0; i < users.length; i++){
        if ((users[i].username === username) && (users[i].password === password)){
            foundUser = true;
            let uid = guid();
            //send uid cookie with max time of 60 min
            res.cookie('uid',uid, { maxAge: 3.6e+6 });
            users[i].uid = uid;
            console.log("user logged in =" + users[i].username);
            res.sendStatus(200);
            break;
        }
    }
    if (!foundUser){
        console.log("user or password where not found");
        res.sendStatus(500);
    }
});

//check uid
app.use("/", function(req,res,next){
    let cookieUid = req.cookies.uid;
    let cookieFound = false;
    if (cookieUid){
        users.forEach(function(user){
            if(cookieUid === user.uid){
                cookieFound = true;
                console.log("verified cookie");
            }
        });
    }
    if (!cookieFound){
        res.render("hello");
    } else {
        next();
    }

});

app.post("/item/", function(req,res){
    let newEvent = req.body;
    newEvent.id = guid();
    newEvent.time = generateTimeStamp();
    events.unshift(newEvent);
    res.redirect("/events");
});

//returns all the items as an array
app.get("/items",function(req,res,next){
    res.send(events);
});

app.delete("/item/:id",function(req,res,next){
    let id = req.params.id;
    console.log("id to delete =" + id);
    let found = false;
    for(i = 0; i < events.length; i++) {
        let event = events[i];
        if(event.id == id) {
            found = true;
            events.splice(i, 1);
            console.log(events);
            console.log("deleted event id = " + id);
            break;
        }
    }
    if (!found){
        next();
    } else {
        res.redirect(res.get("/events"));
    }
});

app.get("/edit-even/:id",function(req,res){
    let id = req
    res.render("edit-event");
});

app.use("/events", function(req,res){
    console.log(events);
    console.log("loading events page");
    res.render("events", {events: events});
});


//returns the item with the right id or 404 if no such an item
app.get("/item/:id", function(req,res,next){
    let id = req.params.id;
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



// overwrite the properties values of the item with the same id or 404 if no such an item
app.put("/item/", function(req,res,next){
    var updatedEvent = req.body;
    var id = updatedEvent.id;
    var found = false;
    events.forEach(function(event){
        if (id === event.id){
            event.name = updatedEvent.name;
            event.time = generateTimeStamp();
            event.location = updatedEvent.location;
            event.food = updatedEvent.food;
            event.img = updatedEvent.img;
            res.send("event " + id + " was replaced");
            found = true;
        }
    });
    if (!found) {
        next();
    }
});

//upload home page
app.get("/public/hello.html", function(req,res,next){
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

//create timestamp
function generateTimeStamp() {
    var date = new Date().toUTCString();
    console.log("Date is:" + date)
    return date;
}