###
jquery-flexirails
Copyright (c) 2011 Raphael Randschau (https://github.com/nicolai86)
###
$ = jQuery

# el is a jQuery selector object, or array
$.flexirails = (el, options) ->
  defaults = 
    paginationOnBottom: true
    paginationOnTop: true
    adapter:
      perPageOptions: [5,10,20,50]
  
  plugin = this
  $el = el
  
  plugin.settings = {}
  
  # private methods
  # initialize a new flexirails instance
  init = (options) ->
    data = $el.data 'flexirails'
    
    plugin.settings = $.extend {}, defaults, options
    plugin.el = el
    
    if !data
      $el.data 'flexirails', plugin
      
      compileViews()
      prepareView()
      createTable()
      plugin.initializeAdapter options.datasource
      createNavigation()
    else
      console.log "initialized"
      
  #
  prepareView = ->
    view = plugin.view || plugin.settings.view
  
    if view.hasOwnProperty 'columns'
      for column in view.columns
        column.selector ?= column.attribute
        
    plugin.view = view
    
  # compiles all Handlebars templates
  compileViews = ->
    plugin.createFlexiTable = Handlebars.compile flexiTable
    plugin.createFlexiRow = Handlebars.compile flexiRow
    plugin.createFlexiNavigation = Handlebars.compile navigation
      
  # creates the flexitable and appends it to the container
  createTable = ->
    $el.append plugin.createFlexiTable plugin
    plugin.flexiTable = $el.find '.fr-table'
  
  # append flexirails navigation elements 
  createNavigation = ->
    if plugin.settings.paginationOnBottom
      $el.append plugin.createFlexiNavigation plugin.adapter
    if plugin.settings.paginationOnTop
      $(plugin.createFlexiNavigation plugin.adapter).insertBefore plugin.flexiTable
      
    plugin.flexiNavigation = $el.find '.fr-navigation'
    
    bindNavigation()
  
  # bind events to navigational elements
  bindNavigation = ->
    bindPerPageSelection()
    bindPageNavigation()
    
  # bind per page selection events
  bindPerPageSelection = ->
    perPage = $el.find '.fr-per-page'
    perPage.val plugin.adapter.options.perPage
    perPage.bind 'change', ->
      plugin.adapter.perPage $(this).val()
    
  # bind first, prev, next and last-link events
  bindPageNavigation = ->
    toFirstPage = $el.find '.fr-first-page'
    toFirstPage.bind 'click', ->
      plugin.adapter.paginateToFirstPage()
      false
      
    toLastPage = $el.find '.fr-last-page'
    toLastPage.bind 'click', ->
      plugin.adapter.paginateToLastPage()
      false
      
    toNextPage = $el.find '.fr-next-page'
    toNextPage.bind 'click', ->
      plugin.adapter.paginateToNextPage()
      false
      
    toPrevPage = $el.find '.fr-prev-page'
    toPrevPage.bind 'click', ->
      plugin.adapter.paginateToPrevPage()
      false
      
  # builds the rowData object for the Handlebars row template
  buildRowData = (item) ->
    rowData = []
    for column in plugin.view.columns
      rowData.push { 
        value: item[column.attribute] 
        selector: column.attribute
      }
  
    { cells: rowData }
  
  # populates the table with data
  populateTable = ->
    adapter = plugin.adapter
    
    table = plugin.flexiTable
    table.find("tr:not(.fr-header)").remove()
    
    for item in adapter.paginatedData()
      rowData = buildRowData item
      table.append plugin.createFlexiRow rowData
      true
      
    updateNavigation()
  
  # update the navigation with adapter information
  updateNavigation = ->
    adapter = plugin.adapter
    
    currentPage = $el.find '.fr-current-page'
    currentPage.html adapter.options.currentPage
    
    totalPages = $el.find '.fr-total-pages'
    totalPages.html adapter.totalPages()
    
    totalResults = $el.find '.fr-total-results'
    totalResults.html adapter.options.entries
    
    perPage = $el.find '.fr-per-page'
    perPage.val adapter.options.perPage
      
  # public methods
  
  # destroy this flexirails instance
  plugin.destroy = ->
    $el.data 'flexirails', null
    $el.find(".fr-table").remove()
    $el.find(".fr-navigation").remove()

  # set up a datasource for flexirails
  plugin.initializeAdapter = (ds) ->
    if ds instanceof Array
      plugin.adapter = new ArrayAdapter ds, plugin.settings.adapter
    else
      plugin.adapter = new RemoteAdapter ds, plugin.settings.adapter
    
    $(plugin.adapter).bind 'ready', () ->
      populateTable()
    
    plugin.adapter.paginate 1
  
  init options
  plugin

# plugin instanciator
$.fn.flexirails = (options) ->
  this.each ->
    new $.flexirails $(this), options

# get the flexirails instance
$.fn.getFlexirails = ->
  this.data 'flexirails'