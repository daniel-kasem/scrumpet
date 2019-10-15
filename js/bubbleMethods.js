var draggingBubble = null;
ThoughtBubble.prototype.draggingBubble = null;

//setChildProperties
ThoughtBubble.prototype.setChildProperties = function(parentElement) {
          
    const parentBubble_Obj = bubbleCollection[parentElement];

    this.isChild = true;       
    this.parentElementID = parentBubble_Obj.name;
    
    parentBubble_Obj.isParent = true;

    if (!parentBubble_Obj.childArray.includes(this.name)) {
        parentBubble_Obj.childArray.push(this.name);
    }
}

//setBubbleXY
ThoughtBubble.prototype.setBubbleXY = function() {
    this.Left = (this.pageElement.offsetLeft);
    this.Top = (this.pageElement.offsetTop);
}

//appendTo
ThoughtBubble.prototype.appendTo = function(parent) {
    parent.appendChild(this);    
}

//render
ThoughtBubble.prototype.render = function(){ 
        
    //div to hold entire bubble           
    this.pageElement = document.createElement("div"),
    this.pageElement.id = this.name,
    this.pageElement.className = "bubble unpopped",
    this.pageElement.style = positionElement(this),
    appendTo(this.pageElement, document.getElementById("blackBoard"));
                    
    //debug
    if(debug){
        var bubbleInfo = function (){
            this.typingBox.innerHTML = "<span>"+this.name +"<br/>"+ "isParent: "+ this.isParent +"<br/>"+ "isChild: "+ this.isChild +"<br/>"+ "parentID:" + this.parentElementID +"<br/>"+ "children:" + this.childArray+"</span>";
        }                    
        this.pageElement.addEventListener( "mouseleave", bubbleInfo.bind(this) )
    }

    //wrapper to position popThis/dragThis buttons together
    this.buttonWrapper = document.createElement("div"),
    this.buttonWrapper.id = this.name + "_buttonWrapper",
    this.buttonWrapper.className = "buttonWrapper",
    appendTo(this.buttonWrapper, this.pageElement);

    //button to minimize/maximize the bubble    
    this.popThis = document.createElement("div"),
    this.popThis.id = this.name + "_popThis",
    this.popThis.className = "popThis",
    appendTo(this.popThis, this.buttonWrapper);

    //drag handle
    this.dragThis = document.createElement("div"),
    this.dragThis.id = this.name + "_dragThis",
    this.dragThis.className = "dragThis",
    appendTo(this.dragThis, this.buttonWrapper);

    //wrapper for centering editable div
    this.holdsTypingBox = document.createElement("div"),
    this.holdsTypingBox.id = this.name + "_holdsTypingBox",
    this.holdsTypingBox.className = "holdsTypingBox",
    appendTo(this.holdsTypingBox, this.pageElement);
    
    //editable div
    this.typingBox = document.createElement("div"),
    this.typingBox.id = this.name + "_typingBox",
    this.typingBox.className = "typingBox",
    this.typingBox.contentEditable = true,
    this.typingBox.spellcheck = false,
    appendTo(this.typingBox, this.holdsTypingBox);                
    this.typingBox.focus();

    //wrapper to hold three circles that serve as "make bubblet" button
    this.makeNew = document.createElement("div"),
    this.makeNew.id = this.name + "_makeNew",
    this.makeNew.className = "makeNew",
    appendTo(this.makeNew, this.pageElement);
    
    //three circles that serve as "make bubblet" button
    this.makeNew_1 = document.createElement("div"),
    this.makeNew_1.id = this.name + "_makeNew_1",
    this.makeNew_1.className = "makeNew_1",
    appendTo(this.makeNew_1, this.makeNew);

    this.makeNew_2 = document.createElement("div"),
    this.makeNew_2.id = this.name + "_makeNew_2",
    this.makeNew_2.className = "makeNew_2",
    appendTo(this.makeNew_2, this.makeNew);

    this.makeNew_3 = document.createElement("div"),
    this.makeNew_3.id = this.name + "_makeNew_3",
    this.makeNew_3.className = "makeNew_3",
    appendTo(this.makeNew_3, this.makeNew);
}

//addListeners
ThoughtBubble.prototype.addListeners = function(){

    //listen for resize and call connectElement
    attachMutationObserver(this.pageElement);
    
    //make bubble div draggable
    dragElement(this.pageElement);

    //make bubble poppable
    this.popThis.setAttribute("onclick", "popBubble('" + this.name + "');");

    //bubblet button - calls the normal bubble constructor, but only bubblets pass a parameter, which is the parent bubble's id
    this.makeNew.setAttribute("onclick", "newBubble('" + this.name + "');");
    
    //click in the bubble and start typing - typingBox has focus on creation, but this allows you to return focus after navigating away
    this.holdsTypingBox.addEventListener("click", function () {
        this.typingBox.focus();
    }.bind(this));

    //when a bubble is dragged into another bubble, connect them by making the dragged bubble a child of the dropzone bubble (and overwrite the existing parentID of the child bubble)
    this.holdsTypingBox.addEventListener("mouseenter", mouseEnterHandler.bind(this));

    this.holdsTypingBox.addEventListener("mouseleave", mouseLeaveHandler.bind(this));

    function mouseEnterHandler(e){
        
        this.holdsTypingBox.addEventListener("mouseup", mouseLeaveHandler.bind(this));
        
        const draggingBubble_local = this.draggingBubble;
        
        if(e.buttons == 1) {
            if ( (draggingBubble_local != null) && (this.name != draggingBubble_local) ){  

                toggleClass(this.pageElement,"unpopped","overlapped");
                toggleClass(document.getElementById(draggingBubble_local),"unpopped","overlapped"); 

                let newParent = this;                       
                this.newChildTimer = setTimeout( function() {
                    let newChild = bubbleCollection[draggingBubble_local];  
                    if (newChild.parentElementID) {
                        
                        //reset parent properties of current parent before moving child over to new parent
                        let currentParent = bubbleCollection[newChild.parentElementID];
                        //remove the dragged bubble from it's old parent
                        currentParent.childArray.splice(
                            currentParent.childArray.indexOf(newChild.name), 1
                        );
                        if (currentParent.childArray.length < 1) {
                            currentParent.isParent = false;
                        }

                        //remove line connecting to current parent
                        let svg = document.getElementById("svg");
                        let line_element = document.getElementById(newChild.name +"_"+ newChild.parentElementID);
                        svg.removeChild(line_element);

                        //remove the old parent from the dragged bubble
                        newChild.parentElementID = "";                                    
                    }
                    //normally if a bubble gains a child, it has no effect on the bubble's parent
                    //but if a bubble/child switches to child/bubble, the new child DOES effect the bubble's parent, because 
                    //the new child of the bubble is still stored as the parent of the bubble, and we don't want both
                    if (newParent.parentElementID) {
                        if (newChild.name == newParent.parentElementID) 
                        {                                        
                            newChild.childArray.splice(
                                newChild.childArray.indexOf(newParent.parentElementID), 1
                            );
                            if (newChild.childArray.length < 1) {
                                newChild.isParent = false;
                            }
                            newParent.parentElementID = "";
                            newParent.isChild = false; 

                            //remove line that was named using the old parent/child relationship, soon we'll create a new line with the proper naming convention using connectElement function
                            let obsolete_line_element = document.getElementById(newParent.name+"_"+newChild.name);
                            svg.removeChild(obsolete_line_element); 
                        }                                 
                    }
                    newChild.setChildProperties(newParent.name);   

                    connectElement(newChild.pageElement);
                    newChild.popSound.play();      
                    if (debug) {
                        debug_MarkParent();                        
                    }
                }.bind(this).bind(draggingBubble_local),1000);                            
            }                        
        }                    
    }

    function mouseLeaveHandler(e) {                            
        if ( (this.draggingBubble != null) && (this.name != this.draggingBubble) ){                                
            toggleClass(this.pageElement,"overlapped","unpopped");
            toggleClass(document.getElementById(this.draggingBubble),"overlapped","unpopped");
            clearTimeout(this.newChildTimer);
            this.holdsTypingBox.removeEventListener("mouseup", mouseLeaveHandler.bind(this));
        }
    }
                   
}
