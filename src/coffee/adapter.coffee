###
jquery-flexirails datasource adapter
Copyright (c) 2011 Raphael Randschau (https://github.com/nicolai86)
###

# Datasource adapter stub. All methods must be implemented to have a custom adapter
class Adapter
  # Sort the data of an adapter by a given column
  sort: (column) ->
  
  # Paginate the data to a given page
  paginate: (to) ->
    
# Static array adapter
class ArrayAdapter
  constructor: (@data) ->
    
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
      
    $(this).trigger 'ready'

# Remote data source adapter
class RemoteAdapter
  constructor: (@url) ->
  
# export datasource wrapper to scope
this.Adapter = Adapter
this.ArrayAdapter = ArrayAdapter
this.RemoteAdapter = RemoteAdapter