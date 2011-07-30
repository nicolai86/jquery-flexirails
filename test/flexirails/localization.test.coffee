module "flexirails-localization"

test "I18n lookup function", ->
  equals (typeof Localization::lookup), "function", "Flexirails.lookup should be available"