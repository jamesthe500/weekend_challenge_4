$(document).ready(function (){
    $('#theForm').submit(function(event){
        event.preventDefault();
        var formData = $('#theForm').serialize();
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
            url: "/board/" + $(this).data("id"),
            success: function(data){
                console.log("He's dead Jim! ", data);

            },
            error: function(xhr, status){
                alert("Error: ", status);
            },
            complete: function(){
                console.log("Delete complete.");
            }
        });
        $(this).parent().remove();
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
        $('#board').append("<div class='answer col-md-12'></div>");
        var $el = $("#board").children().last();
        $el.append("<p>" + data[i].name + "</p>");
        $el.append("<p>" + data[i].answer + "</p>");
       /* $el.append("<button data-id='"+ data[i]._id +"'>DEL</button>");*/ //disabled for gen. users
        $el.children().last().data("id", data[i]._id);
    }
}
