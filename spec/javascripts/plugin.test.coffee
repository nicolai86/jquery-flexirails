describe "jquery-flexirails", ->
  instance = null
  
  initFlexirails = (data = [], view = {}) ->
    $(document.body).append $("<div id='flexirails'></div>")
    
    $("#flexirails").empty()
    elem = $("#flexirails").flexirails { 'datasource':data, 'view': view }
    instance = $(elem).getFlexirails()
  
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
    { city: 'New York', country: 'USA' },
    { city: 'Oklahoma', country: 'USA' },
    { city: 'London', country: 'UK' }
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
      expect( $(".fr-header").children().length ).toBe view.columns.length
      
    it "should add the attribute as td selector", ->
      expect( $(".city").length ).toBeGreaterThan 1
      expect( $(".country").length ).toBeGreaterThan 1
      
  describe "flexirails-column", ->
    beforeEach ->
      initFlexirails data, view
    
    afterEach ->
      destroyFlexirails()
      
    it "should add the attribute as td selector", ->
      expect( $(".fr-row .city").length ).toBeGreaterThan 0
      
  describe "flexirails-cell", ->
    beforeEach ->
      initFlexirails data, view
    
    afterEach ->
      destroyFlexirails()
      
    it "should be able to register formatter for cells", ->
      expect( typeof instance.registerFormatter).toBe 'function'
      
  describe "flexirails-navigation", ->
    beforeEach ->
      initFlexirails data, view
      instance.adapter.perPage 2
      
    afterEach ->
      destroyFlexirails()
      
    it "should display the total number of entries", ->
      expect($('.fr-total-results').html()).toBe instance.adapter.options.entries.toString()
      
    it "should display the correct currentPage", ->
      expect($(".fr-current-page").html()).toBe instance.adapter.options.currentPage.toString()
      
    it "should display the correct totalPage", ->
      expect($(".fr-total-pages").html()).toBe instance.adapter.totalPages().toString()
      
    it "should display the correct page count after perPage is called", ->
      instance.adapter.paginate 2
      expect($(".fr-current-page").html()).toBe '2'
      
    it "should display the correct total pages counter after perPage is called", ->
      instance.adapter.perPage 3
      expect($(".fr-total-pages").html()).toBe '2'
      
    it "should paginate when next link is clicked", ->
      $(".fr-next-page").click()
      expect(instance.adapter.options.currentPage).toBe 2
      
    it "should paginate to last page when last page is clicked", ->
      $(".fr-last-page").click()
      expect(instance.adapter.options.currentPage).toBe instance.adapter.totalPages()
      
    it "should paginate to currentPage when clicking next-prev", ->
      page = instance.adapter.options.currentPage
      $(".fr-next-page").click()
      $(".fr-prev-page").click()
      expect(instance.adapter.options.currentPage).toBe page