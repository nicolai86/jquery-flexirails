###
jquery-flexirails datasource adapter
Copyright (c) 2011 Raphael Randschau (https://github.com/nicolai86)
###

# Datasource adapter stub. All methods must be implemented to have a custom adapter
class window.Adapter
  constructor: (options = {}) ->
    @options = options
    @options.perPage ?= 5
    @options.currentPage ?= 1
    @options.entries ?= 0
    @data = []
    @first = null
    
  # 
  totalPages: ->
    Math.ceil @options.entries / @options.perPage
    
  # sets the perPage option
  perPage: (val) ->
    @options.perPage = val

    @paginate 1
    
  # Sort the data of an adapter by a given column. As soon as the data is sorted
  # an ready event has to be triggered on the Adapter
  sort: (column) ->
    $(this).trigger 'ready'
  
  # Paginate the data to a given page
  paginate: (to) ->
    if @paginationPossible to
      @options.currentPage = to
    
      $(this).trigger 'ready'
    
  # Returns the currently visible data
  paginatedData: ->
    @data
  
  # check if pagination is possible  
  paginationPossible: (to) ->
    to >= 1
    
  # paginates to first page
  paginateToFirstPage: ->
    @paginate 1
  
  # paginates to the next page
  paginateToNextPage: ->
    @paginate @options.currentPage + 1
    
  # paginate to the prev page
  paginateToPrevPage: ->
    @paginate @options.currentPage - 1