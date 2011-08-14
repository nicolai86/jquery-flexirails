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
      
    it "should export paginatedData as a function", ->
      expect(typeof adapter.paginatedData).toBe 'function'
      
    describe "per-page", ->
      it "should change options.perPage value when calling perPage", ->
        adapter.perPage 2
        expect(adapter.options.perPage).toBe 2
      
      it "should fire a ready event when perPage is changed", ->
        $(adapter).one 'ready', ->
          expect(true).toBeTruthy()
        adapter.perPage 2
        
      it "should change options.currentPage to 1 when changing perPage", ->
        adapter.options.currentPage = 2
        adapter.perPage 2
        expect(adapter.options.currentPage).toBe 1
    
    describe "sorting", ->
      it "should fire a ready event when sort is called", ->
        $(adapter).one 'ready', ->
          expect(true).toBeTruthy()
        adapter.sort {}
        
    describe "pagination", ->
      it "should fire a ready event when paginate is called", ->
        $(adapter).one 'ready', ->
          expect(true).toBeTruthy()
        adapter.paginate 2
      
      it "should change options.currentPage value when paginate is called", ->
        adapter.paginate 2
        expect(adapter.options.currentPage).toBe 2

      it "should have a paginateToFirstPage function", ->
        expect(typeof adapter.paginateToFirstPage).toBe 'function'

      it "should have a paginateToNextPage function", ->
        expect(typeof adapter.paginateToNextPage).toBe 'function'

      it "should update options.currentPage when paginateToNextPage is called", ->
        expect(adapter.options.currentPage).toBe 1
        adapter.paginateToNextPage()
        expect(adapter.options.currentPage).toBe 2

      it "should have a paginateToPrevPage function", ->
        expect(typeof adapter.paginateToPrevPage).toBe 'function'

      it "should update options.currentPage when paginateToPrevPage is called", ->
        adapter.paginate 2
        expect(adapter.options.currentPage).toBe 2
        adapter.paginateToPrevPage()
        expect(adapter.options.currentPage).toBe 1
        
      it "should have a paginationPossible function", ->
        expect(typeof adapter.paginationPossible).toBe 'function'
        
      it "should not be possible to paginate belog page 1", ->
        expect(adapter.paginationPossible 0).toBeFalsy()