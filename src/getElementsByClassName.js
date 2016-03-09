// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className){
  // your code here

  // we don't want the original function to be passing on node as an argument, so I'm using a closure.
  function traverse(element) {

  	// Array-like object of classes 
  	var classes = element.classList; 

  	// Output array
  	var output = [];

  	// Check if the element has the class we're looking for
  	if (_.contains(classes, className)) output[0] = element;

  	// Array-like object of immediate children of the element passed as argument
  	var children = element.children;

  	// Number of child elements 
  	// Because this number will be used several times it's faster to save it to a variable
  	var chiLen = children.length;

  	// This is for array concatenation
  	// The fastest method overall across browsers is array[array.length] = newElement
  	var j = output.length;

  	// If the element contains any child element(s), recursively search through them to see if they have the class we're looking for
  	if (chiLen) { // chiLen should be 0 if there aren't any child elements. 0 is a falsy value.
  		// Each child element must be searched
  		for (var i = 0; i < chiLen; i++) {
  			var result = traverse(children[i]);
  			// This is the fastest way of array concatenation across platforms (especially Safari and Chrome)
  			for (var k = 0, n = result.length; k < n; k++) {
  				output[j] = result[k];
  				j++;
  			}
  		}
  	}

  	return output;
  }

  return traverse(document.body);

};
