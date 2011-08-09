describe "jquery-flexirails", ->

  it "should export $.flexirails", ->
    expect(typeof $.fn.flexirails).toEqual "function"
    
  describe "flexirails-instanciation", ->
    beforeEach ->
      $("#flexirails").empty()
      $("#flexirails").flexirails [], {}
    
    afterEach ->
      $("#flexirails").flexirails 'destroy'
      
    it "should add a table to the page", ->
      expect( $("#flexirails > .fr-table").length ).toBeGreaterThan 0
    
    it "should add a header row to the table", ->
      expect( $(".fr-header").length ).toBeGreaterThan 0
    
  describe "flexirails-header", ->
    data = [
      { city: 'Kiel', country: 'Germany' },
      { city: 'New York', country: 'USA' }
    ]
    
    view = 
      columns: [
        { title: 'City', attribute: 'city' },
        { title: 'Country', attribute: 'country' }
      ]
    
    beforeEach ->
      $("#flexirails").empty()
      $("#flexirails").flexirails data, view
    
    afterEach ->
      $("#flexirails").flexirails 'destroy'
      
    it "should create a td for every column", ->
      expect( $(".fr-header").children().length ).toBe 2
      
    it "should set the correct td selector", ->
      expect( $(".city").length ).toBeGreaterThan 0
      expect( $(".country").length ).toBeGreaterThan 0
      