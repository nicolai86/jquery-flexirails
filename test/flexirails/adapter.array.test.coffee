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
    $(adapter).one 'ready', ->
      assert(adapter.data[0].id).should be, 4
      assert(adapter.data[adapter.data.length-1].id).should be, 1
    adapter.sort 'id', false
  
  it "can sort data ascending given an attribute", ->
    $(adapter).one 'ready', ->
      assert(adapter.data[0].id).should be, 1
      assert(adapter.data[adapter.data.length-1].id).should be, 4
    adapter.sort 'id', true
  
  it "should fire a ready event when done sorting", ->
    $(adapter).one 'ready', ->
      ok true, "callback was called"
    adapter.sort 'name'
  
  it "should change paginatedData on perPage call", ->
    $(adapter).one 'ready', ->
      assert(adapter.paginatedData().length).should be, 2
    adapter.perPage 2
    