describe 'flexirails-adapter.array', ->
  adapter = null
  
  data = [
    { id: 1, name: 'John' },
    { id: 3, name: 'Steward' },
    { id: 2, name: 'Michael' },
    { id: 4, name: 'Ann' }
  ]
  
  beforeEach ->
    adapter = new ArrayAdapter data
    
    this.addMatchers {
      toBeA: (type) ->
        this.actual instanceof type
    }
  
  it "can be instanciated", ->
    adapter = new ArrayAdapter []
    expect(adapter).toBeA ArrayAdapter
    
  it "can sort data descending given an attribute", ->
    $(adapter).one 'ready', ->
      expect(adapter.data[0].id).toBe 4
      expect(adapter.data[adapter.data.length-1].id).toBe 1
    adapter.sort 'id', false
  
  it "can sort data ascending given an attribute", ->
    $(adapter).one 'ready', ->
      expect(adapter.data[0].id).toBe 1
      expect(adapter.data[adapter.data.length-1].id).toBe 4
    adapter.sort 'id', true
  
  it "should fire a ready event when done sorting", ->
    $(adapter).one 'ready', ->
      expect(true).toBeTruthy()
    adapter.sort 'name'
  
  it "should change paginatedData on perPage call", ->
    $(adapter).one 'ready', ->
      expect(adapter.paginatedData().length).toBe 2
    adapter.perPage 2
    