###
jquery-flexirails
Copyright (c) 2011 Raphael Randschau (https://github.com/nicolai86)
###
$ = jQuery

###
Flexirails views
###
flexiTable = '''<table class="fr-table">
<tbody>
  <tr class="fr-header">
    {{#view/columns}}
      <td>{{title}}</td>
    {{/view/columns}}
  </tr>
</tbody>
</table>'''

flexiRow = '''<tr class="fr-row">
  {{#cells}}
    <td class="fr-cell">
      {{value}}
    </td>
  {{/cells}}
</tr>'''

###
These methods can be used to interact with flexirails
###
flexirails =

  # compiles all Handlebars templates 
  compileViews: ($this) ->
    data = $this.data 'flexirails'
    
    data.createFlexiTable = Handlebars.compile flexiTable
    data.createFlexiRow = Handlebars.compile flexiRow
    
    $this.data 'flexirails', data

  # creates the flexitable and appends it to the container
  createTable: ($this) ->
    data = $this.data 'flexirails'
    $this.append data.createFlexiTable data
    
  # set up a datasource for flexirails
  initializeAdapter: ($this, ds) ->
    data = $this.data 'flexirails'
    
    if ds instanceof Array
      data.datasource = new ArrayAdapter ds
    else
      data.datasource = new RemoteAdapter ds
    
    $(data.datasource).bind 'ready', () ->
      flexirails.populateTable $this
      
    data.datasource.paginate 1
      
    $this.data 'flexirails', data
    
  #
  buildRowData: ($this, item) ->
    data = $this.data 'flexirails'
    
    rowData = []
    for column in data.view.columns
      rowData.push { value: item[column.attribute] }
      
    { cells: rowData }
    
  # populates the table with data
  populateTable: ($this) ->
    data = $this.data 'flexirails'
    ds = data.datasource
    
    table = $this.find(".fr-table")
    table.find("tr:not(.fr-header)").remove()
    
    for item in ds.paginatedData()
      rowData = flexirails.buildRowData $this, item
      table.append data.createFlexiRow rowData
      true
    
  #
  init : (datasource, view = {}, locales = {}, opts = {}) ->
    $this = $ @
    data = $this.data 'flexirails'
    
    if !data
      data = 
        'view': view
        'locales': locales

      $this.data 'flexirails', data
      
      flexirails.compileViews $this
      flexirails.createTable $this
      flexirails.initializeAdapter $this, datasource
      #flexirails.populateTable $this
      
      console.log "not initialized"
    else
      console.log "initialized"
    
###
Call $('#mydiv').flexirails(datasource, view, locals, options) to initialize
jquery-flexirails for a given datasource on a given div
###
$.fn.flexirails = (method) ->
  if method of flexirails
    return flexirails[ method ].apply this, Array.prototype.slice.call( arguments, 1 )
  else
    # no method was called. try to initialize flexirails
    flexirails.init.apply this, arguments
    
