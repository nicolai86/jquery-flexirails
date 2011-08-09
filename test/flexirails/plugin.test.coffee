describe "jquery-flexirails", ->

  it "should export $.flexirails", ->
    assert(typeof $.fn.flexirails).should be, "function"
    
  describe "flexirails-instanciation", ->
    before ->
      $("#flexirails").empty()
      $("#flexirails").flexirails [], {}
    
    after ->
      $("#flexirails").flexirails 'destroy'
      
    it "should add a table to the page", ->
      assert("#flexirails > .fr-table").should beOnThePage
    
    it "should add a header row to the table", ->
      assert("#flexirails > .fr-table > .fr-header").should beOnThePage