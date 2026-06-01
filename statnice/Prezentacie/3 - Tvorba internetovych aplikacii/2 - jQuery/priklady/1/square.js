$(function() {                          // Pri načítaní stránky
    $(".square").click(SquareRight);    // Pri kliknutí na štvorec ho posunieme doprava
});
 
function SquareRight() {
    $(this).off("click");               // Zakázať to, čo sa robí pri kliku na štvorec
    $(this).animate({                   // Animujeme pohyb o 200px doprava
        "left" : "200px"
    }, {
        duration : 1000,                // Trvanie: 1 sekunda
        complete : function()           // Po dobehnutí animácie
        {
            $(this).text("<");          // Zmení sa text
            $(this).click(SquareLeft);  // Pri kliku sa bude posúvať doľava
        }
    })
    return false;                       // Nechceme, aby sa náhodou išlo na link, na ktorý sme klikli
}
 
// Funkcia SquareLeft je taká istá ako SquareRight, len sa animuje opačným smerom
function SquareLeft() {
    $(this).off("click");
    $(this).animate({
        "left" : "0px"
    }, {
        duration : 1000,
        complete : function()
        {
            $(this).text(">");
            $(this).click(SquareRight);
        }
    })
    return false;
}