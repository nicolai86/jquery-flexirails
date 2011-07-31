###
jquery-flexirails datasource adapter
Copyright (c) 2011 Raphael Randschau (https://github.com/nicolai86)
###

# Datasource adapter stub. All methods must be implemented to have a custom adapter
class Adapter
  constructor: (@options = {}) ->
    @options.perPage ?= 5
    
  # sets the perPage option
  perPage: (val) ->
    @options.perPage = val
    
  # Sort the data of an adapter by a given column. As soon as the data is sorted
  # an ready event has to be triggered on the Adapter
  sort: (column) ->
    $(this).trigger 'ready'
  
  # Paginate the data to a given page
  paginate: (to) ->
    $(this).trigger 'ready'
    
  # Returns the currently visible data
  data: () ->
    []
    
# Static array adapter
class ArrayAdapter extends Adapter
  constructor: (@data, @options = {}) ->    
    @paginate 1
    super @opts
    
  #
  sort: (column, asc = true) ->
    # helper functions for array sorting
    orderAscending = (a, b) ->
      if a[column] < b[column]
        -1
      else if a[column] > b[column]
        1
      else 
        0
        
    orderDescending = (a, b) ->
      if a[column] < b[column]
        1
      else if a[column] > b[column]
        -1
      else 
        0
        
    # switch sorting based on flag
    if asc
      @data.sort orderAscending
    else
      @data.sort orderDescending
      
    super()
  
  #
  paginate: (to) ->
    @minIndex = (to - 1) * @options.perPage
    @maxIndex = to * @options.perPage
    
    super()
    
  #
  paginatedData: () ->
    Array.prototype.slice.call( @data, @minIndex, @maxIndex )

# Remote data source adapter
class RemoteAdapter
  constructor: (@url) ->
  
# export datasource wrapper to scope
this.Adapter = Adapter
this.ArrayAdapter = ArrayAdapter
this.RemoteAdapter = RemoteAdapter