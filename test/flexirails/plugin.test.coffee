module "jquery-flexirails"

test "$.flexirails should be available", ->
  equals (typeof $.flexirails), "function", "$.flexirails should be a function"