describe "jquery-flexirails", ->
  it "should export $().flexirails", ->
    expect(typeof $().flexirails).toEqual 'function'
    
  it "should export $.getFlexirails", ->
    expect(typeof $().getFlexirails).toEqual 'function'