describe 'flexirails-adapter.array', ->
  
  it "should export ArrayAdapter", ->
    expect(typeof ArrayAdapter).toBe 'function'
    
  describe 'instance', ->
    adapter = null
    
    data = [
      { id: 1, name: 'John' },
      { id: 3, name: 'Steward' },
      { id: 2, name: 'Michael' },
      { id: 4, name: 'Ann' }
    ]
    
    beforeEach ->
      adapter = new ArrayAdapter data
    
    it "should be instanciable", ->
      adapter = new ArrayAdapter []
      expect(adapter instanceof ArrayAdapter).toBeTruthy
    
    #
    describe "pagination", ->
      # we have 4 items in the datasource
      it "should have the correct totalPages count", ->
        # default perPage option is 5
        expect(adapter.totalPages()).toBe 1
        
      it "should have the correct totalPages count for multiples of perPage", ->
        adapter.perPage 2
        expect(adapter.totalPages()).toBe 2
      
      it "should have the correct totalPages count for odds of perPage", ->
        adapter.perPage 3
        expect(adapter.totalPages()).toBe 2
    
    #
    describe "sorting", ->
      it "should notify when sorting data", ->
        # notify is a function that triggers the ready-event, which one can
        # bind to using $(adapter).bind 'ready'
        spyOn(adapter, 'notify').andCallThrough()
        adapter.sort 'id', false
        expect(adapter.notify).toHaveBeenCalled()
        
      it "should be able to sort data in descending order", ->
        adapter.sort 'id', false
        
        expect(adapter.data[0].id).toBe 4
        expect(adapter.data[adapter.data.length-1].id).toBe 1
      
      it "should be able to sort data in ascending order", ->
        adapter.sort 'id', true
        expect(adapter.data[0].id).toBe 1
        expect(adapter.data[adapter.data.length-1].id).toBe 4
    
    it "should change paginatedData on perPage call", ->
      adapter.perPage 2
      expect(adapter.paginatedData().length).toBe 2
      