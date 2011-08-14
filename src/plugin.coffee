###
jquery-flexirails
Copyright (c) 2011 Raphael Randschau (https://github.com/nicolai86)
###
$ = jQuery

# el is a jQuery selector object, or array
$.flexirails = (el, options) ->
  defaults = {}
  
  plugin = this
  $el = el
  
  plugin.settings = {}
  
  # private methods
  # initialize a new flexirails instance
  init = ->
    data = $el.data 'flexirails'
    
    plugin.settings = $.extend {}, defaults, options
    plugin.el = el
    
    if !data
      data = 
        'view': options.view
        'locales': options.locales

      $el.data 'flexirails', data
      
      compileViews()
      prepareView()
      createTable()
      plugin.initializeAdapter options.datasource
      createNavigation()
    else
      console.log "initialized"
      
  #
  prepareView = ->
    data = $el.data 'flexirails'
  
    view = data.view
  
    if view.hasOwnProperty 'columns'
      for column in view.columns
        column.selector ?= column.attribute
  
    data.view = view
    $el.data 'flexirails', data
    
  # compiles all Handlebars templates
  compileViews = ->
    data = $el.data 'flexirails'
    
    data.createFlexiTable = Handlebars.compile flexiTable
    data.createFlexiRow = Handlebars.compile flexiRow
    data.createFlexiNavigation = Handlebars.compile navigation
    
    $el.data 'flexirails', data
      
  # creates the flexitable and appends it to the container
  createTable = ->
    data = $el.data 'flexirails'
  
    $el.append data.createFlexiTable data
    data.flexiTable = $el.find '.fr-table'
  
    $el.data 'flexirails', data
  
  # append flexirails navigation elements 
  createNavigation = ->
    data = $el.data 'flexirails'
  
    data.flexiTable.prepend data.createFlexiNavigation data
    data.flexiNavigation = $el.find '.fr-navigation'
  
    bindNavigation()
  
    $el.data 'flexirails', data
  
  # bind events to navigational elements
  bindNavigation = ->
    perPage = $el.find '.fr-per-page'
    perPage.bind 'change', ->
      plugin.adapter.perPage $(this).val()
      
  # builds the rowData object for the Handlebars row template
  buildRowData = (item) ->
    data = $el.data 'flexirails'
  
    rowData = []
    for column in data.view.columns
      rowData.push { 
        value: item[column.attribute] 
        selector: column.attribute
      }
  
    { cells: rowData }
  
  # populates the table with data
  populateTable = ->
    data = $el.data 'flexirails'
    
    adapter = plugin.adapter
    
    table = data.flexiTable
    table.find("tr:not(.fr-header)").remove()
    
    for item in adapter.paginatedData()
      rowData = buildRowData item
      table.append data.createFlexiRow rowData
      true
      
  # public methods
  
  # destroy this flexirails instance
  plugin.destroy = ->
    $el.data 'flexirails', null
    $el.find(".fr-table").remove()

  # set up a datasource for flexirails
  plugin.initializeAdapter = (ds) ->
    if ds instanceof Array
      plugin.adapter = new ArrayAdapter ds
    else
      plugin.adapter = new RemoteAdapter ds
    
    $(plugin.adapter).bind 'ready', () ->
      populateTable()
    
    plugin.adapter.paginate 1
  
  init()
  plugin
