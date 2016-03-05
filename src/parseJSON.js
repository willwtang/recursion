// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  // your code goes here
  // variable declarations
  var index = 0;
  var charNow = json.charAt(0);
  var len = json.length;
  var escapeChar = {
    '\\': '\\',
    'b': '\b',
    't': '\t',
    'n': '\n',
    'f': '\f',
    '"': '"',
    "r": "\r"
    
  }

  // Syntax error - if the character is not expected
  function throwError(error) {
  	throw 'SyntaxError: ' + error;
  }

  // main function for traversing through the string
  function next() {
  	var character = arguments[0];
  	if (character) {
      // If an argument is passed in, before we increment index, we need to make sure the current character is same 
      // as the argument. This is the primary way to check for non-JSON strings. 
  		if (charNow !== character) throwError('unexpected character - expecting ' + '"' + character + '"' + "instead of " + '"' + charNow + '" ' + 'at ' + index);	
  	}
  	
	  index += 1;
    // Get rid of all the whitespace (ONLY USE THIS WHEN NOT DEALING WITH STRINGS!)
	  while (json.charAt(index) && json.charAt(index) <= ' ') index += 1;

	  charNow = index < len ? json.charAt(index) : undefined;
		return charNow;
  }
  
  // function for traversing strings - doesn't have the whitespace function
  function stringNext() {
    var character = arguments[0];
  	if (character) {
  		if (charNow !== character) throwError('unexpected character - expecting ' + '"' + character + '"' + "instead of " + '"' + charNow + '" ' + 'at ' + index);	
  	}
  	
	  index += 1;

	  charNow = index < len ? json.charAt(index) : undefined;
		return charNow;
  }


  function number() {
  	var start = index;

    // Negative number;
  	if (charNow === "-") next('-');

    // Traverse through the numbers;
  	while(charNow >= 0 && charNow <= 9) next();

    // decimal place
  	if(charNow === ".") {
  		next('.');
  		while(charNow >= 0 && charNow <= 9) next();
  	}

    // exponents 
  	if (charNow === "e") {
  		next('e');
  		if (charNow === '-' || charNow === '+') next();
  		while (charNow >= 0 && charNow <= 9) next();
  	}

  	var end = index;

  	var num = json.slice(start, end);

  	return +num;

  }

  function string() {
  	var output = '';
    // The first character of a JSON string is always '"'
  	next('"');

  	while (charNow !== '"') {
      // escape characters
  		if (charNow === '\\') {
        // when \ is detected, skip it and just add whatever is being escaped
  			stringNext('\\');
  			output += escapeChar[charNow];
  			stringNext();
  		} else {
  			output += charNow;
				stringNext();
			}
		}
		next();
		return output;
  }

  function bools() {
  	switch (charNow) {
      // for true, false, and null; all real strings start with '"'. If it starts with a letter, it must be one of
      // these three (undefined is not a JSON object). If next() throws an error then the entire string 
      // is not a valid JSON string.
  		case 't':
  			next('t');
  			next('r');
  			next('u');
  			next('e');
  			return true;
  		case 'f':
  			next('f');
  			next('a');
  			next('l');
  			next('s');
  			next('e');
  			return false;
  		case 'n':
  			next('n');
  			next('u');
  			next('l');
  			next('l');
  			return null;
		}
  }

  function array() {
  	var output = []; 
  	next('[');

    // Recursively parse each element of the array
  	while (charNow && charNow !== "]") {
  		output.push(typeOfValue());
  		if (charNow === ',') next(',');
  	}

    next(']');
  	return output;

  }

  function object() {
  	var output = {};
  	next();

    // Recusrive parse each key-value pair
  	while (charNow && charNow !== "}") {
  		var key = typeOfValue();
  		next(':');
  		var value = typeOfValue();
  		if (charNow === ',') next(',');
  		output[key] = value;
  	}
  	next('}');
  	return output;
  }

  function typeOfValue() {

	  switch(charNow) {

	  	case '"': // JSON strings all start with '"'
	  		return string();

	  	case "[":
	  		return array();

	  	case "{":
	  		return object();

	  	default: 
	  		if ((charNow >= 0 && charNow <= 9) || charNow === "-") return number();
	  		else return bools();
	  }
	}
  
	return typeOfValue();

};