//TODO: refactor to remove create/write/append functions - it was unecessary to complicate a simple native method 
function createElement(elementType) {
	let element = document.createElement(elementType);	
	return element;
}

function writeAttributes(element,attributes) {
	let len = attributes.length;
	for(let i = 0; i < len; i++) {       
		let attribute = attributes[i][0];
		let value = attributes[i][1];
		element.setAttribute(attribute,value);
    }
}

function appendTo(element,parentElement) {
	parentElement.appendChild(element);
}

function getStyleWidth(element){
    return Number( element.style.width.replace("px" ,"") );
}
function getStyleHeight(element){
    return Number( element.style.height.replace("px" ,"") );
}

function toggleClass(element,currentClass,newClass){        
    element.classList.remove(currentClass);
    element.classList.add(newClass);
}
