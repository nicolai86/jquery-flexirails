module "jquery-flexirails"

test "$.flexirails should be available", ->
  equals (typeof $.fn.flexirails), "function", "$.fn.flexirails should be a function"