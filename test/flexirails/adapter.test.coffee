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
  equals adapter.options.perPage, 5, "perPage defaults to 5"
  
test "PerPage should change", ->
  adapter.perPage 2
  equals adapter.options.perPage, 2, "perPage should have been overwritten"
  
module "ArrayAdapter"

data = [
  { id: 1, name: 'John' },
  { id: 3, name: 'Steward' },
  { id: 2, name: 'Michael' },
  { id: 4, name: 'Ann' }
]

test "Can be instanciated with an array", ->
  adapter = new ArrayAdapter data
  ok (adapter instanceof ArrayAdapter), "ArrayAdapter can not be instanciated"

adapter = new ArrayAdapter data  
  
test "Can sort data descending on a given attribute", ->
  adapter.sort 'id', false
  equals (adapter.data[0].id), 4, "First element has highest ID"
  equals (adapter.data[adapter.data.length-1].id), 1, "Last element has lowest ID"
  
test "Can sort data ascending on a given attribute", ->
  adapter.sort 'id', true
  equals (adapter.data[0].id), 1, "First element has lowest ID"
  equals (adapter.data[adapter.data.length-1].id), 4, "Last element has highest ID"
  
test "Fires ready event when done sorting", ->
  $(adapter).bind 'ready', () ->
    ok true, "callback was called"
  adapter.sort 'name'
  
