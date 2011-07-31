# Static array adapter
class ArrayAdapter extends Adapter
  constructor: (data, options = {}) ->        
    super options
    @data = data
    @paginate 1
    
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
    if @data.length > 0
      if asc
        @data.sort orderAscending
      else
        @data.sort orderDescending
      
    super()
  
  #
  paginate: (to) ->
    @minIndex = (to - 1) * @options.perPage
    @maxIndex = to * @options.perPage
    
    super to
    
  #
  paginatedData: () ->
    Array.prototype.slice.call( @data, @minIndex, @maxIndex )

window.ArrayAdapter = ArrayAdapter
