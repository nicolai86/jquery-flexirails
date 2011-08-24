###
jquery-flexirails

Copyright © 2011 Raphael Randschau (https://github.com/leahpar)

Released under MIT-LICENSE:

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
###
$ = jQuery

# el is a jQuery selector object, or array
$.flexirails = (el, options) ->
  defaults = 
    paginationOnBottom: true
    paginationOnTop: true
    formatters: {}
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
      
  # prepare the view to be used in the handlebars view template
  prepareView = ->
    view = plugin.view || plugin.settings.view
    
    defaultFormatter = (td, col, obj, attr) ->
      td.append attr

    if view.hasOwnProperty 'columns'
      for column in view.columns
        column.selector ?= column.attribute

        unless plugin.settings.formatters.hasOwnProperty(column.selector)
          plugin.settings.formatters[column.selector] = defaultFormatter
        
    plugin.view = view
    
  # compiles all Handlebars templates and attach them to the plugin
  compileViews = ->
    plugin.createFlexiTable = Handlebars.compile flexiTable
    plugin.createFlexiNavigation = Handlebars.compile navigation
      
  # creates the flexitable and appends it to the DOM element
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
    tr = $ document.createElement 'tr'
    tr.addClass 'fr-row'
    
    for column in plugin.view.columns
      td = $ document.createElement 'td'
      td.addClass column.attribute
      
      formatter = plugin.settings.formatters[column.attribute]
      formatter td, column, item, item[column.attribute]
      
      tr.append td
      
    tr
  
  # populates the table with data
  populateTable = ->
    adapter = plugin.adapter
    
    table = plugin.flexiTable
    table.find("tr:not(.fr-header)").remove()
    
    for item in adapter.paginatedData()
      rowData = buildRowData item
      table.append rowData
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

  # register a formatter for a certain cell
  plugin.registerFormatter = (selector, fnc) ->
    plugin.settings.formatters[selector] = fnc

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