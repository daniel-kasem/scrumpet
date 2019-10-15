function popBubble(bubble_DivID) {

    var bubble_Div = document.getElementById(bubble_DivID);
    var bubble_Obj = bubbleCollection[bubble_DivID];
    var currentWidth = getStyleWidth(bubble_Div);
    var currentHeight = getStyleHeight(bubble_Div);

    //toggle isPopped value
    bubble_Obj.isPopped = (bubble_Obj.isPopped) ? false : true;
    var bPopping = bubble_Obj.isPopped;

    //change bubble from pink to grey
    togglePoppedClass(bubble_Div, bPopping);

    //update bubble.x/y properties to current position of page element
    bubble_Obj.setBubbleXY();

    //derive new popped/unpopped x/y based on current x/y and current/future size 
    if (bPopping) {
        var newSize = 50;
        //shrink toward center
        var newLeft = Math.floor(bubble_Obj.Left + (currentWidth / 2) - (newSize / 2));
        var newTop = Math.floor(bubble_Obj.Top + (currentHeight / 2) - (newSize / 2));
    } else {
        var newSize = 200;
        //grow from center
        var newLeft = Math.floor(bubble_Obj.Left - (newSize / 2) + (currentWidth / 2));
        var newTop = Math.floor(bubble_Obj.Top - (newSize / 2) + (currentHeight / 2));
    }
    var styleString =
        "left:" + (newLeft).toString() + "px;" +
        "top:" + (newTop).toString() + "px;" +
        "width:" + (newSize).toString() + "px;" +
        "height:" + (newSize).toString() + "px;";

    //update page element to new size and position
    bubble_Div.setAttribute("style", styleString);

    //update bubble.x/y properties to match new position of page element
    bubble_Obj.setBubbleXY();

    //update line elements connected to this bubble element based on new page position
    connectBubble(bubble_Obj);

    //bubbleSoundFile.play();
    bubble_Obj.popSound.play()

    function togglePoppedClass(bubble_Div, bPopping) {
        let newClass = (bPopping) ? "popped" : "unpopped";
        let currentClass = (bPopping) ? "unpopped" : "popped";
        bubble_Div.classList.remove(currentClass);
        bubble_Div.classList.add(newClass);
    }
}
