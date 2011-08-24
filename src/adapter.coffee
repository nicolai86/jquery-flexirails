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
    @options.perPageOptions ?= [5,10,15,20,25]
    @options.entries ?= 0
    @data = []
    @first = null
    
  #
  notify: ->
    $(this).trigger 'ready'
    
  # total number of pages available for pagination
  totalPages: ->
    Math.ceil @options.entries / @options.perPage
    
  # sets the perPage option
  perPage: (val) ->
    @options.perPage = val

    @paginate 1
    
  # Sort the data of an adapter by a given column. As soon as the data is sorted
  # an ready event has to be triggered on the Adapter
  sort: (column) ->
    @notify()
  
  # Paginate the data to a given page
  paginate: (to) ->
    @options.currentPage = to
    @notify()
    
  # Returns the currently visible data
  paginatedData: ->
    @data
  
  # check if pagination is possible  
  paginationPossible: (to) ->
    to >= 1 && to <= @totalPages()
    
  # paginates to first page
  paginateToFirstPage: ->
    @paginate 1
  
  # paginates to the next page
  paginateToNextPage: ->
    @paginate @options.currentPage + 1
    
  # paginate to the prev page
  paginateToPrevPage: ->
    @paginate @options.currentPage - 1
    
  # paginate to the last page
  paginateToLastPage: ->
    @paginate @totalPages()