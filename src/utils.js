
$.extractAttribute = function(obj, qualifiedName) {
  var value;
  var parts = qualifiedName.split(".");
  var current = obj;
  
  for (var i = 1; i < parts.length; i++) {
    if (current.hasOwnProperty(parts[i])) {
      current = current[parts[i]];
    } else {
      break;
    }
  }

  value = current;
  var attribute = parts[parts.length-1];
  if (value != null && typeof(value) == 'object') {
    if (value.hasOwnProperty(attribute)) {  
      value = current[attribute];
    } else {
      value = null;
    }
  }

  return value;
}

jQuery.fn.moveLeft = function() {
  return this.each(function() {
    $(this).insertBefore($(this).prev()); 
  });
};

jQuery.fn.moveRight = function() {
  return this.each(function() {
    $(this).insertAfter($(this).next());
  });
}
