const socket = io();

var answer;

socket.on("checkboxes", function(checks) { //Unchecks unwanted list that are checked due to page refresh
    console.log(checks)
    $(".check").each(function() {
        if(!checks.find(element => element == $(this).attr("id")))
        {
            $(this)[0].checked = false;
        }
    });
});

socket.on("show", function(generated) { //Receives the letter and shows it on screen

    var letter = generated[0];
    answer = generated[1];

    $(".character").text(letter);
});

$("#answerForm").submit(function(e) {
    var input = $(".input").val();

    if(input.toString().toLowerCase() === answer.toLowerCase()) //Sends a success notification and requests a new letter
    {
        var notification = alertify.notify(`Correct Answer: ${answer}`, 'success', 2, function(){  console.log('Correct'); });
        socket.emit("request");
        $(".input").val("");
    }
    else //Sends a error notification
    {
        var notification = alertify.notify(`Correct Answer: ${answer}`, 'error', 2, function(){  console.log('Incorrect'); });
    }
    
    e.preventDefault(); //Prevents form from refreshing the page
});

$(".check").on("change", function(e) { //Handles list selects
    if($(".check:checked").length == 0 && !this.checked) //Prevents user from unchecking every list
    {
        this.checked = true;
    }
    else
    {
        selectList(e.target.id);
    }
    
});

function selectList(list)
{
    socket.emit("selectList", list);
}

