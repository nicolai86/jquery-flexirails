###
jquery-flexirails
Copyright (c) 2011 Raphael Randschau (https://github.com/nicolai86)
###
$ = jQuery

###
These methods can be used to interact with flexirails
###
flexirails =
  init : (datasource, view = {}, locales = {}, opts = {}) ->
    obj = @
    
###
Call $('#mydiv').flexirails(datasource, view, locals, options) to initialize
jquery-flexirails for a given datasource on a given div
###
$.fn.flexirails = (method) ->
  if method of flexirails
    return flexirails[ method ].apply this, Array.prototype.slice.call( arguments, 1 )
  else
    # no method was called. try to initialize flexirails
    flexirails.init.apply this, arguments
    
