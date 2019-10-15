
    const bubbleCollection = {};    
    let bubbleCount = 0;
    let bubbleX = 0;
    let bubbleY = 0;

    function newBubble(parentElement) {
        
        const bubble_Obj = new ThoughtBubble();
        bubbleCollection[bubble_Obj.name] = bubble_Obj;

        //if parentElement is not null, it's a child
        if (parentElement) {
            bubble_Obj.setChildProperties(parentElement);
        }

        bubble_Obj.render();
        bubble_Obj.addListeners();
        //now that bubble is written to page, store it's initial x/y position on the page
        bubble_Obj.setBubbleXY();        

        if (bubble_Obj.isChild) {
            //attach bubble to parent upon creation            
            connectBubble(bubble_Obj);                    
        }

        bubble_Obj.popSound.play() //TODO: popBubble is accessing the the file through the declared variable, bubble_Obj is using the object property    
    }

    function positionElement(bubble_Obj) {
        
        let myX;
        let myY;
        
        //don't allow bubble to be created off screen
        const X_keepInViewport = (X) => {
            X = (X > 0) ? X : 0;                 
            let X_viewport = window.innerWidth || document.documentElement.clientWidth;
            let X_fromRight = X + bubble_Obj.width
            X = (X_fromRight < X_viewport) ? X : (X_viewport - bubble_Obj.width); 
            return X;
        };
        const Y_keepInViewport = (Y) => {
            Y = (Y > 0) ? Y : 0;                 
            let Y_viewport = window.innerHeight || document.documentElement.clientHeight;
            let Y_fromBottom = Y + bubble_Obj.height;
            Y = (Y_fromBottom < Y_viewport) ? Y : (Y_viewport - bubble_Obj.height); 
            return Y;
        };

        if (bubble_Obj.isChild) {
            const parentBubble_Obj = bubbleCollection[bubble_Obj.parentElementID];
            bubble_Obj.width *= .75;
            bubble_Obj.height *= .75;
            myX = 5;
            myY = 5;

            //bublets all have the same Y, offset from the parent bubble.
            //bublets all have different X, offset from center of parent bubble and by # of previous siblings                        
            myY = parentBubble_Obj.Top + 150;

            let centerOnParentX = parentBubble_Obj.Left + (parentBubble_Obj.width / 2) - (bubble_Obj.width / 2);
            let childNumber = parentBubble_Obj.childArray.indexOf(bubble_Obj.name);

            switch (childNumber) {
                case 0:
                    myX = centerOnParentX;
                    break;
                case 1:
                    myX = centerOnParentX - (bubble_Obj.width);
                    break;
                case 2:
                    myX = centerOnParentX + (bubble_Obj.width);
                    break;
                case 3:
                    myX = centerOnParentX - (bubble_Obj.width * 2);
                    break;
                case 4:
                    myX = centerOnParentX + (bubble_Obj.width * 2);
                    break;
                case 5:
                    myX = centerOnParentX - (bubble_Obj.width * 3);
                    break;
                case 6:
                    myX = centerOnParentX + (bubble_Obj.width * 3);
                    break;
                case 7:
                    myX = centerOnParentX - (bubble_Obj.width * 4);
                    break;
                case 8:
                    myX = centerOnParentX + (bubble_Obj.width * 4);
                    break;
                case 9:
                    myX = centerOnParentX - (bubble_Obj.width * 5);
                    break;
                case 10:
                    myX = centerOnParentX + (bubble_Obj.width * 5);
                    break;                    
                default:
                    myX = bubbleX;
                    break;
            }
            myX = X_keepInViewport(myX);
            myY = Y_keepInViewport(myY);
        } else {
            //start bubbleX at 5% if first bubble in row, otherwise move it 25% to the right of previous bubble                        
            //start bubbleY at 5% for first bubble, add 1.5*height for every new row
            if (( bubbleX >= 80) || (bubbleX === 0)) {
                bubbleX = 5;
                if (bubbleY) {
                    bubbleY += (bubble_Obj.height * 1.5);
                } else {
                    bubbleY = 5;
                }
            } else {
                bubbleX += 25;
            }
            bubbleX = X_keepInViewport(bubbleX);
            bubbleY = Y_keepInViewport(bubbleY);
        }

        //build style string using the size and position variables we just calculated
        const attString = buildAttString(bubble_Obj);

        return attString;

        function buildAttString(bubbleObject) {
            let atts = "";
            let x, y, pixelOrPercent
            if (bubbleObject.isChild) {
                x = myX;
                y = myY;
                pixelOrPercent = "px;"
            } else {
                x = bubbleX;
                y = bubbleY;
                pixelOrPercent = "%;"
            }
            atts =
            "left:" + (x).toString() + pixelOrPercent +
            "top:" + (y).toString() + "px;" +
            "width:" + (bubble_Obj.width).toString() + "px;" +
            "height:" + (bubble_Obj.height).toString() + "px;";
            return atts;
        }

    }
