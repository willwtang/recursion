// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {
  // your code goes here
  //non JSON values
  var type = Object.prototype.toString.call(obj);
  var output = [];

  function putInQuotes(string) {
  	return '"' + string + '"';
  }

  switch(type) {

  	case '[object Null]':
  		return "null";

  	case '[object String]':
  		return putInQuotes(obj);

  	case '[object Boolean]':
  		return String(obj);

  	case '[object Number]':
  		return String(obj);

  	case '[object Array]':
			var len = obj.length;

	  	for (var i = 0; i < len; i++) {
	  		output[i] = stringifyJSON(obj[i]) || "null";
	  	}
	  	return "[" + output.join(',') + "]"

  	case '[object Object]': 
	  	
	  	for (var prop in obj) {
	  		if (obj.hasOwnProperty(prop)) {
		  		var value = stringifyJSON(obj[prop]);

		  		if(value) {
			  		var pair = putInQuotes(prop) + ":" + stringifyJSON(obj[prop]);
			  		output.push(pair);
		  		}
		  	}
	  	}
	  	
	  	return "{" + output.join(",") + "}";
	  
	  default: 
	  	return undefined;
	}

};

