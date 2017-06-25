console.log("script loaded");

var eventToEdit;

//handle register click
$("#register").click(function(){
   let username = $("#username").val();
   let password = $("#password").val();
   $.post("/register/"+ username + "/" + password, function(data,status){
       console.log("user was added");
       $("#loginErrorMessage").text("You were successfully registered please login");
       $("#loginErrorMessage").css("color","#4CAF50");
       $("#loginErrorMessage").css("visibility","visible");
   }).fail(function(){
       $("#loginErrorMessage").text("User name already taken");
       $("#loginErrorMessage").css("color","#F44336");
       $("#loginErrorMessage").css("visibility","visible");
       setTimeout(()=>{$("#loginErrorMessage").css("visibility","hidden")}, 3000);
   })
});



//handle login click
$("#login").click(function(){
    let username = $("#username").val();
    let password = $("#password").val();
    $.post("/login/"+ username + "/" + password, function(data,status){
        console.log("correct username and password");
        window.location.replace("/events");
    }).fail(function(){
        $("#loginErrorMessage").text("Wrong user name or password");
        $("#loginErrorMessage").css("color","#F44336");
        $("#loginErrorMessage").css("visibility","visible");
        setTimeout(()=>{$("#loginErrorMessage").css("visibility","hidden")}, 3000);
    });
});

//handle click delete
$(".delete").on("click",()=>{
    let id = event.target.id;
    $.ajax({
        url: "/item/"+ id,
        type: "DELETE",
        success: function(result) {
            console.log("event id " + id + " was deleted");
            location.reload();
        }
    });
});

//handle edit event
$(".edit").on("click",()=>{
   let id = event.target.id;
    window.location.replace("/edit/" + id);
});

//cancel button
$("#cancelBtn").on("click", ()=>{
    window.location.replace("/events");

});

//update button
$("#updateBtn").on("click", ()=>{
    console.log("clicked on update");
    let newEvent = {};
    newEvent.id = $("#eventId").text();
    newEvent.time = Date();
    newEvent.name = $("[name='name']").val();
    newEvent.location = $("[name='location']").val();
    newEvent.food = $("[name='food']").val();
    newEvent.img = $("[name='img']").val();
    console.log(newEvent);
    $.ajax({
        type: "PUT",
        url: "/item/",
        data: newEvent,
        success: function (result) {
            window.location.replace("/events");
        }
    });
});

