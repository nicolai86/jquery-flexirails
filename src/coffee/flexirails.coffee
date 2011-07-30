$ = jQuery

methods =
  init : (opts) ->
    obj = @
    
$.fn.plugin = (method) ->
  if method of methods
    return methods[ method ].apply this, Array.prototype.slice.call( arguments, 1 )
  else
    $.error "Method #{method} does not exist on jQuery.plugin"