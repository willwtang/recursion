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

  function throwError(error) {
  	throw 'SyntaxError: ' + error;
  }

  function next() {
  	var character = arguments[0];
  	if (character) {
  		if (charNow !== character) throwError('unexpected character - expecting ' + '"' + character + '"' + "instead of " + '"' + charNow + '" ' + 'at ' + index);	
  	}
  	
	  index += 1;
	  while (json.charAt(index) && json.charAt(index) <= ' ') index += 1;

	  charNow = index < len ? json.charAt(index) : undefined;
		return charNow;
  }
  
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
  	if (charNow === "-") next('-');
  	while(charNow >= 0 && charNow <= 9) next();
  	if(charNow === ".") {
  		next('.');
  		while(charNow >= 0 && charNow <= 9) next();
  	}
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
  	next('"');
  	while (charNow !== '"') {
  		if (charNow === '\\') {
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
  	next();

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

  	while (charNow && charNow !== "}") {
  		var key = typeOfValue();
  		next(':');
  		var value = typeOfValue();
  		if (charNow !== '}') next();
  		output[key] = value;
  	}
  	next('}');
  	return output;
  }

  function typeOfValue() {

	  switch(charNow) {

	  	case '"':
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