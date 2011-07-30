$ = jQuery

methods =
  init : (opts) ->
    obj = @
    
$.fn.flexirails = (method) ->
  if method of methods
    return methods[ method ].apply this, Array.prototype.slice.call( arguments, 1 )
  else
    $.error "Method #{method} does not exist on jquery-flexirails"
    
