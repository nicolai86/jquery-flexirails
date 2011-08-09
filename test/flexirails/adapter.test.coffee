describe "flexirails-adapter", ->
  adapter = null
  
  beforeEach ->
    adapter = new Adapter {}
    
  afterEach ->
    adapter = new Adapter {}
    
  it "should have a defaul perPage of 5", ->  
    expect(adapter.options.perPage).toBe 5
  
  it "Adapter currentPage option defaults to 1", ->
    expect(adapter.options.currentPage).toBe 1
  
  it "perPage should change options.perPage value", ->
    adapter.perPage 2
    expect(adapter.options.perPage).toBe 2
  
  it "paginatedData should be available", ->
    expect(typeof adapter.paginatedData).toBe 'function'