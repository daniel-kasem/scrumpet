


function attachMutationObserver(element) {
  
  // Select the node that will be observed for mutations
  const targetNode = element;

  // Options for the observer (which mutations to observe)
  const config = {
    attributes: true,
    childList: false,
    subtree: false
  };

  // Callback function to execute when mutations are observed
  const mutationCallback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'attributes') {    
        connectElement(targetNode);
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(mutationCallback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

  // Later, you can stop observing
  //observer.disconnect();
}
