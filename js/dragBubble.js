// Make the DIV element draggable:
function dragElement(pageElement) {
  let X_mouseMoved = 0;
  let Y_mouseMoved = 0;
  let X_mouse = 0;
  let Y_mouse = 0;
  
  let X_viewport = window.innerWidth || document.documentElement.clientWidth;
  let Y_viewport = window.innerHeight || document.documentElement.clientHeight;
  let oBubble = bubbleCollection[pageElement.id];

  document.getElementById(pageElement.id + "_dragThis").addEventListener("mousedown", startDragging);  

  function startDragging(event) {

    event = event || window.event;
    event.preventDefault();
    
    // get the mouse cursor position at startup:
    X_mouse = event.clientX;
    Y_mouse = event.clientY;

    //draggingBubble is global and gets checked in the mouseover event of all the other bubbles on the page, to detect when bubbles overlap
    //TODO: I moved this global to the prototype to cut globals, but it seems like a weird place so I'll try making a single object to hold all globals    
    ThoughtBubble.prototype.draggingBubble = pageElement.id;
    //temporarily set the dragged element to lowest layer so it can trigger mouseover on the collision box of all other elements
    pageElement.style.zIndex = 0;

    // call a function whenever the cursor moves:
    document.addEventListener("mousemove", whileDragging);
    //call a function to remove the drag listeners and stop dragging when the left-click is released
    document.addEventListener("mouseup", stopDragging);

  }
  
  function whileDragging(event) {

    event = event || window.event;
    event.preventDefault();
    
    // calculate the new cursor position:
    X_mouseMoved = X_mouse - event.clientX;
    Y_mouseMoved = Y_mouse - event.clientY;
    X_mouse = event.clientX;
    Y_mouse = event.clientY;
    
    // set the element's new position:
    //as long as the new position doesn't drag it off the page
    //TODO: move this up top and bind the variables
    let X_new = (pageElement.offsetLeft - X_mouseMoved);
    let Y_new = (pageElement.offsetTop - Y_mouseMoved);
    let leftNew;
    let topNew;
    
    if( (X_new > 0) && (X_new + oBubble.width < X_viewport) ){
      leftNew = (pageElement.offsetLeft - X_mouseMoved) + "px";
    } else {
      if (X_new < 0) {
        leftNew = "0px";
      } else if ((X_new + oBubble.width) > X_viewport){
        leftNew = (X_viewport - oBubble.width) + "px";
      }
    }

    if( (Y_new > 0) && (Y_new + oBubble.height < Y_viewport) ){  
      topNew = (pageElement.offsetTop - Y_mouseMoved) + "px";
    } else {
      if (Y_new < 0) {
        topNew = "0px";
      } else if ((Y_new + oBubble.width) > Y_viewport){
        topNew = (Y_viewport - oBubble.height) + "px";
      }
    }
    
    requestAnimationFrame(function(){
      updateBubblePosition(leftNew,topNew)
    });

    //update connecting lines as bubble is dragged and x/y changes
    //TODO: this is passing the page element to a function that derives it's js object every time the mouse moves...
    //...so it might be better to derive the object once in this function and pass it directly to the connectElement (and refactor connectElement)
    connectElement(pageElement);

  }
function updateBubblePosition(newLeft,newTop){
  pageElement.style.left = newLeft;
  pageElement.style.top = newTop;
}
  function stopDragging() {
    // stop moving when mouse button is released:
    document.removeEventListener("mousemove", whileDragging);
    document.removeEventListener("mouseup", stopDragging);
    
    //earlier in whileDragging() we set the dragged element to lowest layer so it can trigger mouseover on the collision box of all other elements
    //now let's set it back
    pageElement.style.zIndex = 1;
  

    //draggingBubble is global and gets checked in the mouseover event of all the other bubbles on the page, to detect when bubbles overlap
    //TODO: I moved this global to the prototype to cut globals, but it seems like a weird place so I'll try making a single object to hold all globals    
    ThoughtBubble.prototype.draggingBubble = null;
  }
}




























//window.onload = addNewListeners();
var offX;
var offY;

function addNewListeners(pageElement){
  document.getElementById(pageElement.id + '_dragThis').addEventListener('mousedown', function(e){mouseDown(e, pageElement)}, false);
  window.addEventListener('mouseup', function(e){mouseUp(pageElement)}, false);

}

function mouseUp(pageElement)
{
  //window.removeEventListener('mousemove', divMove, true);
  //window.removeEventListener('mousemove', function(e){divMove(e,pageElement)}, true);
  window.removeEventListener('mousemove', function(e){divMove(e, pageElement)}, true);
}

function mouseDown(e, pageElement){
  var div = document.getElementById(pageElement.id);
  offY= e.clientY-parseInt(div.offsetTop);
  offX= e.clientX-parseInt(div.offsetLeft);
  window.addEventListener('mousemove', function(e){divMove(e, pageElement)}, true);
}

function divMove(e, pageElement){
  var div = document.getElementById(pageElement.id);
  div.style.position = 'absolute';
  div.style.top = (e.clientY-offY) + 'px';
  div.style.left = (e.clientX-offX) + 'px';
}




// pageElement.addEventListener("drag",function(){connectElement(pageElement)});
  // var element = pageElement;
  // var elementHandle = (document.getElementById(element.id + "_dragThis"));
  // elementHandle.ondrag = function(){ connectElement(element) }
