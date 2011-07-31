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
    $(adapter).unbind 'ready'
  adapter.sort 'name'
  
test "PerPage should change paginatedData", ->
  adapter.perPage 2
  equals (adapter.paginatedData().length), 2, "perPage should change paginatedData"