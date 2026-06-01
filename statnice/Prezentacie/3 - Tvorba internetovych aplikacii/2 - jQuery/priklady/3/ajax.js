$(function() {
    $("button.start").click(function() {
        AJAX();
    });
});
 
function AJAX()
{
    $.ajax({
	    type: "POST",
	    url: "save.php",
	    data: { name: "John", location: "Boston" }
    }).done(function( msg ) {
	    $("div.info").text(msg);
    });
}