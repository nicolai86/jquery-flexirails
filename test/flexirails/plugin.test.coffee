module "jquery-flexirails"

data = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Michael' }
]

datasourceFnc = () ->
  data

test "$.flexirails should be available", ->
  equals (typeof $.fn.flexirails), "function", "$.fn.flexirails should be a function"
  
test "$.flexirails should accept an array as datasource", ->
  $("#flexirails").flexirails data
  ok true, "Calling flexirails with a datasource only should work."
  
test "$.flexirails should accept a function as datasource", ->
  $("#flexirails").flexirails datasourceFnc
  ok true, "Calling flexirails with a datasource function should work."