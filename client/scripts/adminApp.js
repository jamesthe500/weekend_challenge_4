var theQuestion = "";
var index = 0;
var i = 0;
var onesHeight = null;
var allTheAnswers;
var windowWidth = window.innerWidth;
todaysQuestion();

$(document).ready(function (){

    $('#theForm').submit(function(event){
        event.preventDefault();
        var questionPkg = encodeURI(theQuestion);
        var formData = $('#theForm').serialize() + "&question=" + questionPkg + "&index=" + index;
        if (formData.indexOf('%3C') > 0) {
            return alert("Please don't use the greater-than (>), nor the less-than (<) symbols.");
        } else if
        (formData.indexOf('%3E') > 0) {
            return alert("Please don't use the greater-than (>), nor the less-than (<) symbols.");
        } else {
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
        console.log($el);
        $.ajax({
            type: "DELETE",
            url: "/board/" + $el.data("id"),
            success: function(data){
                $el.parent().slideUp(800, function(){
                    $el.parent().remove();
                    removeFromLocalArray(data._id);
                    updateContainer(allTheAnswers);
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

    function removeFromLocalArray(id){
        for(var i = allTheAnswers.length - 1; i >= 0; i--){
            if(allTheAnswers[i]._id == id) {
                allTheAnswers.splice(i, 1);
                break;
            }
        }
    }

    getData();

    $("#refresh").on('click', function(){
        getData();
    });



}); //doc ready

// corrects the formatting when the user resizes after loading.
var timedOut;
$(window).resize(function(){
    clearTimeout(timedOut);
    timedOut = setTimeout(doAResize, 500);
});

function doAResize() {
    if(windowWidth != window.innerWidth){
        updateContainer(allTheAnswers);
        windowWidth = window.innerWidth;
    }

}


function getData(){
    $.ajax({
        type: "GET",
        url: "/board",
        success: function(data){
            allTheAnswers = data;
            updateContainer(data);
            adjustAnswerHeights(data);
        }
    })
}

function updateContainer(data){
    $('#board').empty();
    $('#board').css('opacity', 0);
    var allAnswerText = "";
    if ($(window).width() >= 992){
        onesHeight = 0;
    } else {
        onesHeight = null;
    }
    for(i = data.length - 1; i >= data.length - 100; i--) {
        allAnswerText += updateContainerPith(data);
    }
    $('#board').append(allAnswerText);
    $('#board').animate({opacity: 1}, 300);
    adjustAnswerHeights(data);
}

function getDataWithNew(){
    $.ajax({
        type: "GET",
        url: "/board",
        success: function(data){
            allTheAnswers = data;
            updateContainerWithNew(data);
        }
    })
}

function updateContainerWithNew(data){
    var allAnswerText = "";
    $('#board').empty();
    $('#board').css('opacity', 0);
    if ($(window).width() >= 992){
        onesHeight = 0;
    }
    for(i = data.length - 1; i >= 0; i--){
        allAnswerText += updateContainerPith(data);
    }
    $('#board').append(allAnswerText);
    var $el = $("#board").children().first();
    $el.css("display", "none");
    adjustAnswerHeights(data);
    $('#board').animate({opacity: 1}, 300);
    $el.slideDown(900, function(){
        $('#name, #answer').val('');
    });

}

// after the dom has been built, this adjusts the heights
function adjustAnswerHeights(data){
    var $el = $('#board').children();
    for(var i = 0; i < data.length; i += 2){
        $el.eq(i).addClass('leftBlue');
        $el.eq(i).next().addClass('rightBlue');
        if ($el.eq(i).height() > $el.eq(i).next().height()){
            onesHeight = $el.eq(i).height();
            $el.eq(i).next().height(onesHeight);
        } else {
            onesHeight = $el.eq(i).next().height();
            $el.eq(i).height(onesHeight);
        }
         $el.eq(i).find("button").css({top: $el.eq(i).height() -29 + "px", left: + $el.eq(i).width() - 35 + "px"}).data("id", $el.eq(i).find("button").attr("data-id"));
         $el.eq(i).next().find("button").css({top: ($el.eq(i).next().height() -29) + "px", left: + $el.eq(i).next().width() - 35 + "px"}).data("id", $el.eq(i).next().find("button").attr("data-id")); // disabled for general users
    }
}

function updateContainerPith(data){
    var colorIndex = data[i].index % 8;
    var thisAnswer = "<div class='entry col-xs-12 col-sm-12 col-md-6 col-lg-6 blue" + colorIndex + "'>";
    thisAnswer += "<h3>" + data[i].question + "</h3>";
    thisAnswer += "<p class='word-block aName'>" + data[i].name.trim() + " says: </p>";
    thisAnswer += '<p class="word-block aAnswer">\"' + data[i].answer.trim() + '\"</p>';
    thisAnswer += "<button class='btn btn-warning deletes' data-id='"+ data[i]._id +"'>DEL</button>"; //disabled for gen. users
    thisAnswer += "</div>";
    return thisAnswer;
}


function todaysQuestion(){
    var questions = [];
    $.ajax({
        url: "/data",
        async: true,
        success: function(data){
            questions = data.questions;
        }

    }).always(function() {
        var today = new Date().getTime();
        var start = 1439096400000; //midnight, the night of 2015-8-9 in CDT
        index = Math.floor((today - start) / 86400000); // That's divided by day in ms.
        theQuestion = questions[index];
        $('#theQuestion').html(theQuestion + " (" + ((questions.length - 10) - index) + " left)"); // shows the number left, assumes the warning queston is in there as well as 7 blanks.
    });
}