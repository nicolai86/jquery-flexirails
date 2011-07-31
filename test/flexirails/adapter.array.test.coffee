describe 'flexirails-adapter.array', ->
  adapter = null
  
  data = [
    { id: 1, name: 'John' },
    { id: 3, name: 'Steward' },
    { id: 2, name: 'Michael' },
    { id: 4, name: 'Ann' }
  ]
  
  before ->
    adapter = new ArrayAdapter data
  
  it "can be instanciated", ->
    adapter = new ArrayAdapter []
    assert(adapter).should beA, ArrayAdapter
    
  it "can sort data descending given an attribute", ->
    adapter.sort 'id', false
    assert(adapter.data[0].id).should be, 4
    assert(adapter.data[adapter.data.length-1].id).should be, 1
  
  it "can sort data ascending given an attribute", ->
    adapter.sort 'id', true
    assert(adapter.data[0].id).should be, 1
    assert(adapter.data[adapter.data.length-1].id).should be, 4
  
  it "should fire a ready event when done sorting", ->
    $(adapter).bind 'ready', () ->
      ok true, "callback was called"
      $(adapter).unbind 'ready'
    adapter.sort 'name'
  
  it "perPage should change paginatedData", ->
    adapter.perPage 2
    assert(adapter.paginatedData().length).should be, 2