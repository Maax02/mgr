$(function() {
    slideshow = new Slideshow();
});
 
function Slideshow()
{
    var myImageList = [];
 
    $("div.thumbs a").each(function() {
        thisImage = [$(this).attr('href')];
        myImageList = myImageList.concat(thisImage);    
    });
 
    var currentIndex = 0;
    var maxIndex = myImageList.length - 1;
    var nextIndex = (currentIndex + 1) % maxIndex;
 
    $("img.imageFront").attr('src', myImageList[currentIndex]);
    $("img.imageBack").attr('src', myImageList[nextIndex]);
 
    var self = this;
 
    this.fadeToNext = function() {
        $("img.imageFront").delay(2000).animate({
            opacity : 0.0
        }, {
            duration : 2000,
            easing : 'linear',
            complete : function()
            {
                currentIndex = (currentIndex + 1) % maxIndex;
                nextIndex = (currentIndex + 1) % maxIndex;
 
                $("img.imageFront").css('opacity', 1.0);
                $("img.imageFront").attr('src', myImageList[currentIndex]);
                $("img.imageBack").attr('src', myImageList[nextIndex]);
                self.fadeToNext();
            }
        });
    }
 
    $("button.start").click(function() {
        self.fadeToNext();
    });
}