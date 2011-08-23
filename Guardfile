# watch coffee-script source and recompile the entire project if a single file changes
guard 'shell' do
  watch(%r{^src/.+\.coffee}) do
    %x{ cake build }
    "#{Time.now.strftime "%H:%M"} : flexirails compiled."
  end
  
  watch(%r{^test/flexirails/.+\.coffee}) do |m|
    %x{ cake build }
    "#{Time.now.strftime "%H:%M"} : flexirails tests compiled."
  end
end

# Run JS and CoffeeScript files in a typical Rails 3.1 fashion, placing Underscore templates in app/views/*.jst
# Your spec files end with _spec.{js,coffee}.

spec_location = "spec/javascripts/%s_spec"

# uncomment if you use NerdCapsSpec.js
# spec_location = "spec/javascripts/%sSpec"

guard 'jasmine-headless-webkit' do
  watch(%r{^app/views/.*\.jst$})
  watch(%r{^public/javascripts/(.*)\.js$}) { |m| newest_js_file(spec_location % m[1]) }
  watch(%r{^app/assets/javascripts/(.*)\.(js|coffee)$}) { |m| newest_js_file(spec_location % m[1]) }
  watch(%r{^spec/javascripts/(.*)_spec\..*}) { |m| newest_js_file(spec_location % m[1]) }
end

