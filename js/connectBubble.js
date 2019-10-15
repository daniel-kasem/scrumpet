
//call setBubbleXY and connectBubble by passing the bubble element and deriving the bubble object
function connectElement(element) {
  const bubble_Obj = bubbleCollection[element.id];
  bubble_Obj.setBubbleXY();
  connectBubble(bubble_Obj);
}

function connectBubble(bubble_Obj) {

  const currentWidth = getStyleWidth(bubble_Obj.pageElement);
  const currentHeight = getStyleHeight(bubble_Obj.pageElement);
  let newLeft = Math.floor(bubble_Obj.Left + (currentWidth / 2));
  let newTop = Math.floor(bubble_Obj.Top + (currentHeight / 2));

  const lineName = bubble_Obj.name + "_" + bubble_Obj.parentElementID
  let line_Element = document.getElementById(lineName);

  //create a new line if bubble has parent but line between them doesn't already exist
  let bNeedsLine = (bubble_Obj.parentElementID);
  let bHasLine = (line_Element);
  if (bNeedsLine && !bHasLine) {
    line_Element = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    let svg = document.getElementById("svg");
    svg.appendChild(line_Element);
    line_Element.style.zIndex = -1;
  }


  if (bubble_Obj.isChild) {

    let parentBubble_Obj = bubbleCollection[bubble_Obj.parentElementID];
    let parentBubble_Div = document.getElementById(bubble_Obj.parentElementID);

    let Par_currentWidth = getStyleWidth(parentBubble_Div);
    let Par_currentHeight = getStyleHeight(parentBubble_Div);
    let Par_newLeft = Math.floor(parentBubble_Obj.Left + (Par_currentWidth / 2));
    let Par_newTop = Math.floor(parentBubble_Obj.Top + (Par_currentHeight / 2));

    line_Element.setAttribute("id", lineName);
    line_Element.classList.add("bubbleLine");    
    requestAnimationFrame(function(){updateLinePosition(line_Element,newLeft,newTop,Par_newLeft,Par_newTop)});
  }

  if (bubble_Obj.isParent) {
    
    //parent moving, needs to loop through it's children and reconnect lines
    
    let len = bubble_Obj.childArray.length;

    for (let i = 0; i < len; i++) {
      let childBubble_Obj = bubbleCollection[bubble_Obj.childArray[i]];
      let lineName = childBubble_Obj.name + "_" + bubble_Obj.name;
      let line_Element = document.getElementById(lineName);
      if (line_Element) {
        let childBubble_Div = document.getElementById(childBubble_Obj.name);;

        let child_currentWidth = getStyleWidth(childBubble_Div);
        let child_currentHeight = getStyleHeight(childBubble_Div);
        let child_newLeft = Math.floor(childBubble_Obj.Left + (child_currentWidth / 2));
        let child_newTop = Math.floor(childBubble_Obj.Top + (child_currentHeight / 2));

        line_Element.setAttribute("id", lineName);
        line_Element.setAttribute("class","bubbleLine");
        requestAnimationFrame(function(){
          updateLinePosition(line_Element,child_newLeft,child_newTop,newLeft,newTop)
        });        
      }
    }
  }
}
function updateLinePosition(line,x1,y1,x2,y2){
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
}
