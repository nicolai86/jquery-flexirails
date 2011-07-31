###
jquery-flexirails datasource adapter
Copyright (c) 2011 Raphael Randschau (https://github.com/nicolai86)
###

# Datasource adapter stub. All methods must be implemented to have a custom adapter
class Adapter
  constructor: (@options = {}) ->
    @options.perPage ?= 5
    @options.currentPage ?= 1
    
  # sets the perPage option
  perPage: (val) ->
    @options.perPage = val
    
    @paginate @options.currentPage
    
  # Sort the data of an adapter by a given column. As soon as the data is sorted
  # an ready event has to be triggered on the Adapter
  sort: (column) ->
    $(this).trigger 'ready'
  
  # Paginate the data to a given page
  paginate: (to) ->
    @options.currentPage = to
    
    $(this).trigger 'ready'
    
  # Returns the currently visible data
  data: () ->
    []
    
# Remote data source adapter
class RemoteAdapter
  constructor: (@url) ->
  
# export datasource wrapper to scope
this.Adapter = Adapter
this.RemoteAdapter = RemoteAdapter