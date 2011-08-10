###
jquery-flexirails
Copyright (c) 2011 Raphael Randschau (https://github.com/nicolai86)
###
$ = jQuery

###
These methods can be used to interact with flexirails
###
methods =
  # compiles all Handlebars templates
  compileViews: ($this) ->
    data = $this.data 'flexirails'
    
    data.createFlexiTable = Handlebars.compile flexiTable
    data.createFlexiRow = Handlebars.compile flexiRow
    data.createFlexiNavigation = Handlebars.compile navigation
    
    $this.data 'flexirails', data
    
  #
  prepareView: ($this) ->
    data = $this.data 'flexirails'
    
    view = data.view

    if view.hasOwnProperty 'columns'
      for column in view.columns
        column.selector ?= column.attribute
      
    data.view = view
    $this.data 'flexirails', data

  # creates the flexitable and appends it to the container
  createTable: ($this) ->
    data = $this.data 'flexirails'
    
    $this.append data.createFlexiTable data
    data.flexiTable = $this.find '.fr-table'
    
    $this.data 'flexirails', data
    
  createNavigation: ($this) ->
    data = $this.data 'flexirails'
    
    data.flexiTable.prepend data.createFlexiNavigation data
    data.flexiNavigation = $this.find '.fr-navigation'
    
    $this.data 'flexirails', data
    
  # set up a datasource for flexirails
  initializeAdapter: (ds, $this) ->
    data = $this.data 'flexirails'
    
    if ds instanceof Array
      data.datasource = new ArrayAdapter ds
    else
      data.datasource = new RemoteAdapter ds
    
    $(data.datasource).bind 'ready', () ->
      methods.populateTable $this
      
    data.datasource.paginate 1
      
    $this.data 'flexirails', data
    
  # builds the rowData object for the Handlebars row template
  buildRowData: ($this, item) ->
    data = $this.data 'flexirails'
    
    rowData = []
    for column in data.view.columns
      rowData.push { 
        value: item[column.attribute] 
        selector: column.attribute
      }
      
    { cells: rowData }
    
  # populates the table with data
  populateTable: ($this) ->
    data = $this.data 'flexirails'
    ds = data.datasource
    
    table = data.flexiTable
    table.find("tr:not(.fr-header)").remove()
    
    for item in ds.paginatedData()
      rowData = methods.buildRowData $this, item
      table.append data.createFlexiRow rowData
      true
    
  # destroy this flexirails instance
  destroy:  () ->
    $this = $ @
    $this.data 'flexirails', null
    $this.find(".fr-table").remove()
    
  #
  init : (datasource, view = {}, locales = {}, opts = {}) ->
    $this = $ @
    data = $this.data 'flexirails'
    
    if !data
      data = 
        'view': view
        'locales': locales

      $this.data 'flexirails', data
      
      methods.compileViews $this
      methods.prepareView $this
      methods.createTable $this
      methods.initializeAdapter datasource, $this
      methods.createNavigation $this
    else
      console.log "initialized"
    
###
Call $('#mydiv').flexirails(datasource, view, locals, options) to initialize
jquery-flexirails for a given datasource on a given div
###
$.fn.flexirails = (method) ->
  if method of methods
    fnc = methods[ method ]
    args = Array.prototype.slice.call( arguments, 1 )
    return fnc.apply this, args
  else
    # no method was called. try to initialize flexirails
    methods.init.apply this, arguments
