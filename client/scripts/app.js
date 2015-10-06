var theQuestion = "";
var index = 0;
var i = 0;

$(document).ready(function (){
    todaysQuestion();

    $('#theQuestion').html(theQuestion);

    $('#theForm').submit(function(event){
        event.preventDefault();
        var questionPkg = encodeURI(theQuestion);
        console.log($('#theForm'));
        var formData = $('#theForm').serialize() + "&question=" + questionPkg + "&index=" + index;
        if (formData.indexOf('%3C') > 0) {
            return alert("Please don't use the greater-than (>), nor the less-than (<) symbols.");
        } else if
        (formData.indexOf('%3E') > 0) {
            return alert("Please don't use the greater-than (>), nor the less-than (<) symbols.");
        } else {
            console.log(formData);
            $.ajax({
                type: "POST",
                url: "/board",
                data: formData,
                success: function () {
                    getDataWithNew();
                }
            });
        }
    });


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
    $('#board').css('opacity', 0);
    for(i = 0; i < data.length; i++) {
        updateContainerPith(data);
    }
    $('#board').animate({opacity: 1}, 500);
}

function getDataWithNew(){
    $.ajax({
        type: "GET",
        url: "/board",
        success: function(data){
            console.log(data);
            $('#board').append(data);
            updateContainerWithNew(data);
        }
    })
}

function updateContainerWithNew(data){
    $('#board').empty();
    for(i = 0; i < data.length; i++){
        if (i+1 == data.length){
            updateContainerPith(data);
            var $el = $("#board").children().first();
            $el.css("display", "none");
            $el.slideDown(600, function(){
                $('#name, #answer').val('');
            });
        } else {
            updateContainerPith(data);
        }
    }
}

function updateContainerPith(data){
    var colorIndex = data[i].index % 8;
    $('#board').prepend("<div class='entry col-xs-12 col-sm-12 col-md-6 col-lg-6 blue" + colorIndex + "'></div>");
    var $el = $("#board").children().first();
    $el.append("<h3>" + data[i].question + "</h3>");
    $el.append("<p class='word-block aName'>" + data[i].name + " says: </p>");
    $el.append('<p class="word-block aAnswer">\"' + data[i].answer + '\"</p>');
    /*$el.append("<button class='btn btn-warning deletes' data-id='"+ data[i]._id +"'>DEL</button>");*/ //disabled for gen. users
    $el.children().last().data("id", data[i]._id);
}


function todaysQuestion(){
    var questions = [];
    $.ajax({
        url: "/data",
        async: false,
        success: function(data){
            questions = data.questions;
            console.log("questions: " + data.questions);
        }

    }).always(function() {
        var today = new Date().getTime();
        var start = 1439096400000; //midnight, the night of 2015-8-9 in CDT
        index = Math.floor((today - start) / 86400000); // That's divided by day in ms.
        theQuestion = questions[index];
    });
}
