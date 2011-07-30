module "jquery-flexirails"

test "$.flexirails should be available", ->
  equals (typeof $.fn.flexirails), "function", "$.fn.flexirails should be a function"
  
test "$.flexirails should accept a datasource", ->
  ok false, "todo implement datasource handling"
  
test "$.flexirails should accept a view", ->
  ok false, "todo implement view handling"
  
test "$.flexirails should accept locales", ->
  ok false, "todo implement locale handling"