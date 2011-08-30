# el is a jQuery selector object, or array
class window.Flexirails
  constructor: (@el, options = {}) ->
    @options = $.extend {}, Flexirails::defaultOptions, options
    
    @el.data 'flexirails', @
    
    @compileViews()
    @prepareView()
    @createTable()
    @initializeAdapter options.datasource
    @createNavigation()
  
  # compiles all Handlebars templates and attach them to the instance
  compileViews: ->
    @createFlexiTable = Handlebars.compile flexiTable
    @createFlexiNavigation = Handlebars.compile navigation
      
  # prepare the view to be used in the handlebars view template
  prepareView: ->
    view = @view || @options.view
  
    defaultFormatter = (td, col, obj, attr) ->
      td.append attr
  
    if view.hasOwnProperty 'columns'
      for column in view.columns
        column.selector ?= column.attribute
  
        unless @options.formatters.hasOwnProperty(column.selector)
          @options.formatters[column.selector] = defaultFormatter
      
    @view = view
  
  # creates the flexitable and appends it to the DOM element
  createTable: ->
    @el.append @createFlexiTable @
    @flexiTable = @el.find '.fr-table'
  
  # append flexirails navigation elements 
  createNavigation: ->
    if @options.paginationOnBottom
      @el.append @createFlexiNavigation @adapter
    if @options.paginationOnTop
      $(@createFlexiNavigation @adapter).insertBefore @flexiTable
  
    @flexiNavigation = @el.find '.fr-navigation'
  
    @bindNavigation()
  
  # bind events to navigational elements
  bindNavigation: ->
    @bindPerPageSelection()
    @bindPageNavigation()
  
  # bind per page selection events
  bindPerPageSelection: ->
    perPage = @el.find '.fr-per-page'
    perPage.val @adapter.options.perPage
    perPage.bind 'change', =>
      @adapter.perPage perPage.val()
  
  # bind first, prev, next and last-link events
  bindPageNavigation: ->
    toFirstPage = @el.find '.fr-first-page'
    toFirstPage.bind 'click', =>
      @adapter.paginateToFirstPage()
      false
  
    toLastPage = @el.find '.fr-last-page'
    toLastPage.bind 'click', =>
      @adapter.paginateToLastPage()
      false
  
    toNextPage = @el.find '.fr-next-page'
    toNextPage.bind 'click', =>
      @adapter.paginateToNextPage()
      false
  
    toPrevPage = @el.find '.fr-prev-page'
    toPrevPage.bind 'click', =>
      @adapter.paginateToPrevPage()
      false
  
  # builds the rowData object for the Handlebars row template
  buildRowData: (item) ->
    tr = $ document.createElement 'tr'
    tr.addClass 'fr-row'
  
    for column in @view.columns
      td = $ document.createElement 'td'
      td.addClass column.attribute
  
      formatter = @options.formatters[column.attribute]
      formatter td, column, item, item[column.attribute]
  
      tr.append td
  
    tr
  
  # remove all data from the table
  emptyTable: ->
    table = @flexiTable
    table.find("tr:not(.fr-header)").remove()
  
  # populates the table with data
  populateTable: ->
    @emptyTable()
    table = @flexiTable
  
    for item in @adapter.paginatedData()
      rowData = @buildRowData item
      table.append rowData
      true
  
    @updateNavigation()
  
  # update the navigation with adapter information
  updateNavigation: ->
    currentPage = @el.find '.fr-current-page'
    currentPage.html @adapter.options.currentPage
  
    totalPages = @el.find '.fr-total-pages'
    totalPages.html @adapter.totalPages()
  
    totalResults = @el.find '.fr-total-results'
    totalResults.html @adapter.options.entries
  
    perPage = @el.find '.fr-per-page'
    perPage.val @adapter.options.perPage
  
  # destroy this flexirails instance
  destroy: ->
    @el.data 'flexirails', null
    @el.find(".fr-table").remove()
    @el.find(".fr-navigation").remove()
  
  # register a formatter for a certain cell
  registerFormatter: (selector, fnc) ->
    @options.formatters[selector] = fnc
  
  # set up a datasource for flexirails
  initializeAdapter: (ds) ->
    if ds instanceof Array
      @adapter = new ArrayAdapter ds, @options.adapter
    else
      @adapter = new RemoteAdapter ds, @options.adapter
  
    $(@adapter).bind 'ready', () =>
      @populateTable()
  
    @adapter.paginate 1
  
  # remove the view and re-render it
  invalidate: ->
    @emptyTable()
    @populateTable()
    true

window.Flexirails::defaultOptions =
  paginationOnBottom: true
  paginationOnTop: true
  formatters: {}
  adapter:
    perPageOptions: [5,10,20,50]