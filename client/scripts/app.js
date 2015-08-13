var theQuestion = "";
var index = 0;

$(document).ready(function (){
    todaysQuestion();

    $('#theQuestion').html(theQuestion);

    $('#theForm').submit(function(event){
        event.preventDefault();
        var questionPkg = encodeURI(theQuestion);
        var formData = $('#theForm').serialize() + "&question=" + questionPkg + "&index=" + index;
        console.log(formData);
        $.ajax({
            type: "POST",
            url: "/board",
            data: formData,
            success: function(){
                getData();
            }
        });
    });

    /*    clickers.clickNorm();
     clickers.clickAdmin();*/


    $("#board").on('click', 'button', function(){
        var $el = $(this);
        $.ajax({
            type: "DELETE",
            url: "/board/" + $el.data("id"),
            success: function(data){
                console.log("He's dead Jim! ", data);
                $el.parent().slideUp(800, function(){
                    $el.parent().remove();
                });

            },
            error: function(xhr, status){
                alert("Error: ", status);
            },
            complete: function(){
                console.log("Delete complete.");
            }
        });

    });

    getData();

    $("#refresh").on('click', function(){
        getData();
        console.log("refreshed!");
    });



}); //doc ready

function getData(){
    $.ajax({
        type: "GET",
        url: "/board",
        success: function(data){
            console.log(data);
            $('#board').append(data);
            updateContainer(data);
        }
    })
}

function updateContainer(data){
    $('#board').empty();
    for(var i = 0; i < data.length; i++){
        if (i+1 == data.length){
            var colorIndex = data[i].index % 8;
            $('#board').prepend("<div class='entry col-xs-12 col-sm-12 col-md-6 col-lg-6 blue" + colorIndex + "'></div>");
            var $el = $("#board").children().first();
            $el.css("display", "none");
            $el.append("<h3>" + data[i].question + "</h3>");
            $el.append("<p class='word-block aName'>" + data[i].name + " says: </p>");
            $el.append('<p class="word-block aAnswer">\"' + data[i].answer + '\"</p>');
            /*$el.append("<button class='btn btn-warning deletes' data-id='"+ data[i]._id +"'>DEL</button>");*/ //disabled for gen. users
            $el.children().last().data("id", data[i]._id);
            $el.slideDown(600);
        } else {
            var colorIndex = data[i].index % 8;
            $('#board').prepend("<div class='entry col-xs-12 col-sm-12 col-md-6 col-lg-6 blue" + colorIndex + "'></div>");
            var $el = $("#board").children().first();
            $el.append("<h3>" + data[i].question + "</h3>");
            $el.append("<p class='word-block aName'>" + data[i].name + " says: </p>");
            $el.append('<p class="word-block aAnswer">\"' + data[i].answer + '\"</p>');
            /*$el.append("<button class='btn btn-warning deletes' data-id='"+ data[i]._id +"'>DEL</button>");*/ //disabled for gen. users
            $el.children().last().data("id", data[i]._id);
        }
    }
}

function todaysQuestion(){
    var questions = ["How's the weather up there?", "What inspired you?", "Whom do you love?", "What made you the angriest recently?", "What kind do you have?", "Where do you come from?", "Where does it hurt?", "What is art?", "Have you had that baby yet?", "Would you like something to eat?", "Where did you go wrong?", "How can I make this better?", "Meow?", "PC or Mac?", "What's your favorite potato dish?", "What did you have for dinner last night?"];
    var today = new Date().getTime();
    var start = 1439096400000; //midnight, the night of 2015-8-9 in CDT
    index = Math.floor((today - start) / 86400000);
    console.log("now: " + today);
    console.log("index: " + index);
    theQuestion = questions[index];
}
