describe "flexirails-adapter", ->
  
  it "should export Adapter", ->
    expect(typeof Adapter).toBe 'function'
  
  describe "instance", ->
    adapter = null
    
    beforeEach ->
      adapter = new Adapter {}
      
    afterEach ->
      adapter = new Adapter {}
      
    it "should have a default perPage value of 5", ->  
      expect(adapter.options.perPage).toBe 5
    
    it "should have a default currentPage value of 1", ->
      expect(adapter.options.currentPage).toBe 1
    
    it "should change perPage option value when calling perPage", ->
      adapter.perPage 2
      expect(adapter.options.perPage).toBe 2
    
    it "should export paginatedData as a function", ->
      expect(typeof adapter.paginatedData).toBe 'function'