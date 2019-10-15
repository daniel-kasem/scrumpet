    //remove scrollbars - bubbles aren't allowed off the page
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
    
    //single main button on the page, creates new ThoughtBubble objects that get rendered as HTML elements
    document.getElementById("addBubble").onclick = function(){newBubble(null)};

    //setting debug to true will display certain bubble properties on the page to help track how they change
    //const debug = true;
    const debug = false;

    function debug_MarkParent() {

        for (let bubble in bubbleCollection) {
            bubble_Obj = bubbleCollection[bubble];
            if (bubble_Obj.isParent) {
                bubble_Obj.pageElement.classList.add("debug");
            }else if ( bubble_Obj.pageElement.classList.contains("debug") ){
                bubble_Obj.pageElement.classList.remove("debug");
            }
        }
    }

    //TODO - reloadBubbles stopped working, process needs to restart a few more features
    //loop through existing bubbles when loading a saved session, to reattach drag/drop functions and 
    function reloadBubbles() {
        //const bubbleSoundFile = new Audio("C:/wamp64/www/bubbleDragon/audio/addBubble.mp3"); TODO:  cheap hack to allow sound files in save state folder, please halp
        const allBubbles = document.getElementsByClassName("bubble");
        const len = allBubbles.length;
        for (let i = 0; i < len; i++) {
            dragElement(allBubbles.item(i));
            //count the reloaded bubbles so new bubbles are numbered correctly
            bubbleCount++;
        }

    }
    window.onload = reloadBubbles;
