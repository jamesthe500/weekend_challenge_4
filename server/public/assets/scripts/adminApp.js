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
                console.log(allTheAnswers);
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
        updateContainerW(allTheAnswers);
        windowWidth = window.innerWidth;
    }

}


function getData(){
    $.ajax({
        type: "GET",
        url: "/board",
        success: function(data){
            allTheAnswers = data;
            $('#board').append(data);
            updateContainer(data);
        }
    })
}

function updateContainer(data){
    $('#board').empty();
    $('#board').css('opacity', 0);
    if ($(window).width() >= 992){
        onesHeight = 0;
    } else {
        onesHeight = null;
    }
    for(i = 0; i < data.length; i++) {
        updateContainerPith(data);
    }
    $('#board').animate({opacity: 1}, 300);
}

function getDataWithNew(){
    $.ajax({
        type: "GET",
        url: "/board",
        success: function(data){
            console.log(data);
            allTheAnswers = data;
            $('#board').append(data);
            updateContainerWithNew(data);
        }
    })
}

function updateContainerWithNew(data){
    $('#board').empty();
    if ($(window).width() >= 992){
        onesHeight = 0;
    }
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
    $el.append("<button style='left:" + ($el.width() - 35) + "px' class='btn btn-warning deletes' data-id='"+ data[i]._id +"'>DEL</button>"); //disabled for gen. users
    $el.children().last().data("id", data[i]._id);

    // Setting heights: 1st, see if the screen is even wide enough for mucking about
    if (onesHeight != null){
        // if the total number of answers is even, follow  this pattern. Odd- the other.
        if (data.length % 2 == 0){
            // if we're on an even number, set the heights. otherwise, carry on.
            if (i % 2 != 0){
                $el.addClass('leftBlue');
                $el.next().addClass('rightBlue');
                if ($el.height() > $el.next().height()){
                    onesHeight = $el.height();
                    $el.next().height(onesHeight);
                    $el.height(onesHeight);
                } else {
                    onesHeight = $el.next().height();
                    $el.height(onesHeight);
                    $el.next().height(onesHeight);
                }

            }
        } else {
            // Now if it's odd, set heights, otherwise carry on.
            if (i % 2 == 0){
                $el.addClass('leftBlue');
                $el.next().addClass('rightBlue');
                if ($el.height() > $el.next().height()){
                    onesHeight = $el.height();
                    $el.next().height(onesHeight);
                    $el.height(onesHeight);
                } else {
                    onesHeight = $el.next().height();
                    $el.height(onesHeight);
                    $el.next().height(onesHeight);
                }

            }
        }
        $el.find("button").css("top", ($el.height() -29) + "px");
         $el.next().find("button").css("top", ($el.next().height() -29) + "px"); // disabled for general users
    }
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
        $('#theQuestion').html(theQuestion);
    });
}
