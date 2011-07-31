describe "flexirails-adapter", ->
  adapter = null
  
  before ->
    adapter = new Adapter {}
    
  after ->
    adapter = new Adapter {}
    
  it "should have a defaul perPage of 5", ->  
    assert(adapter.options.perPage).should eql, 5
  
  it "Adapter currentPage option defaults to 1", ->
    assert(adapter.options.currentPage).should eql, 1
  
  it "perPage should change options.perPage value", ->
    adapter.perPage 2
    assert(adapter.options.perPage).should eql, 2
  
  it "paginatedData should be available", ->
    assert(typeof adapter.paginatedData).should eql, 'function'