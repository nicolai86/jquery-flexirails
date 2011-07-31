module "flexirails-adapter"

test "Adapter should be available", ->
  equals (typeof Adapter), 'function', 'Adapter is not available'

test "ArrayAdapter should be available", ->
  equals (typeof ArrayAdapter), 'function', 'ArrayAdapter is not available'
  
test "RemoteAdapter should be available", ->
  equals (typeof RemoteAdapter), 'function', 'RemoteAdapter is not available'


module "Adapter"

adapter = new Adapter()

test "Adapter perPage option defaults to 5", ->  
  equals adapter.options.perPage, 5, "perPage doesnt default to 5"
  
test "Adapter currentPage option defaults to 1", ->
  equals adapter.options.currentPage, 1, "currentPage doesnt default to 1"
  
test "PerPage should change", ->
  adapter.perPage 2
  equals adapter.options.perPage, 2, "perPage should have been overwritten"