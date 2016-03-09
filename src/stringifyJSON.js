// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {
  // your code goes here

  // What we do in this function depends on what type of value we're dealing with
  // Object.prototype's toString is the best way to tell the type 
  // typeof can be erroneous especially when dealing with functions, null, and undefined
  var type = Object.prototype.toString.call(obj);

  // This function is used to put true strings and object keys in quotes
  function putInQuotes(string) {
  	return '"' + string + '"';
  }

  switch(type) {

  	// null becomes a string, but undefined is non-JSON
  	case '[object Null]': 
  		return "null";

  	// true strings are put in quotes
  	case '[object String]': 
  		return putInQuotes(obj);

  	// Fairly straight-forward - numbers and booleans become strings without the quotes
  	case '[object Boolean]': 
  		return String(obj);

  	case '[object Number]': 
  		return String(obj);

  	// When it comes to arrays, stringifyJSON() must be recursively called on each element
  	// That way, each element will be formatted the way we want. Moreover, if the element is an array or object literal, 
  	// it must be deeply traversed to make sure we get all of the elements in our string
  	case '[object Array]':
			var len = obj.length;
			var output = [];
			// Loop through each element and call stringify on it
	  	for (var i = 0; i < len; i++) {
	  		// If there's a non-JSON object, stringify will return undefined, which is a falsy value
	  		// In that case, "null" will be passed in instead (this is the behavior of the native version JSON.stringify());
	  		output[i] = stringifyJSON(obj[i]) || "null";
	  	}
	  	// Make the output array into a string
	  	return "[" + output.join(',') + "]"

	  // For objects, the keys are already strings, so nothing needs to be done to them except put them in quotes.
	  // However, values can be any data structure, so recursion is needed for those.
  	case '[object Object]': 
  		var output = [];
	  	
	  	for (var prop in obj) {
	  		if (obj.hasOwnProperty(prop)) {

		  		var value = stringifyJSON(obj[prop]);
	  			// JSON.stringify leaves out any key-value pair where the value is not a JSON object. This is to implement that aspect 
	  			// of the function
		  		if(value) {
			  		var pair = putInQuotes(prop) + ":" + value;
			  		output.push(pair);
		  		}
		  	}
	  	}
	  	// Makes whole the output array into a string
	  	return "{" + output.join(",") + "}";
	  
	  // If it's none of the above it's not a JSON object. We can return any falsy value here but since undefined is not a JSON value I just 
	  // used that
	  default: 
	  	return undefined;
	}

};

