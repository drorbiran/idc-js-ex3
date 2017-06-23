console.log("script loaded");

//handle register click
$("#register").click(function(){
   let username = $("#username").val();
   let password = $("#password").val();
   $.post("/register/"+ username + "/" + password, function(data,status){
       console.log("user was added");
       $("#info").text("You were successfully registered please login");
   }).fail(function(){
       $("#info").text("User name already taken");
   });
});



//handle login click
$("#login").click(function(){
    let username = $("#username").val();
    let password = $("#password").val();
    $.post("/login/"+ username + "/" + password, function(data,status){
        console.log("correct username and password");
        window.location.replace("/events");
    }).fail(function(){
        $("#info").text("User not found Please try again");
    });
});