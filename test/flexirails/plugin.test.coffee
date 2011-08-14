describe "jquery-flexirails", ->
  instance = null
  
  initFlexirails = (data = [], view = {}) ->
    $("#flexirails").empty()
    instance = $.flexirails $("#flexirails"), {'datasource':data, 'view': view, locales:{}}
  
  destroyFlexirails = ->
    instance.destroy()
  
  it "should export $.flexirails", ->
    expect(typeof $.flexirails).toEqual "function"
    
  describe "flexirails-instanciation", ->
    beforeEach ->
      initFlexirails()
    
    afterEach ->
      destroyFlexirails()
      
    it "should add a table to the page", ->
      expect( $(".fr-table").length ).toBeGreaterThan 0
    
    it "should add a header row to the table", ->
      expect( $(".fr-header").length ).toBeGreaterThan 0
  
  # mock data
  data = [
    { city: 'Kiel', country: 'Germany' },
    { city: 'New York', country: 'USA' }
  ]
  
  view = 
    columns: [
      { title: 'City', attribute: 'city' },
      { title: 'Country', attribute: 'country' }
    ]
  
  describe "flexirails-header", ->
    beforeEach ->
      initFlexirails data, view
    
    afterEach ->
      destroyFlexirails()
      
    it "should create a td for every column", ->
      expect( $(".fr-header").children().length ).toBe 2
      
    it "should add the attribute as td selector", ->
      expect( $(".city").length ).toBeGreaterThan 0
      expect( $(".country").length ).toBeGreaterThan 0
      
  describe "flexirails-column", ->
    beforeEach ->
      initFlexirails data, view
    
    afterEach ->
      destroyFlexirails()
      
    it "should add the attribute as td selector", ->
      expect( $(".fr-row .city").length ).toBeGreaterThan 0
      