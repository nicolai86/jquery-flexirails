guard 'shell' do
  watch(%r{^src/.+\.coffee}) do
    %x{ cake build }
    "#{Time.now.strftime "%H:%M"} : flexirails compiled."
  end
end

spec_location = "spec/javascripts/%s"

guard 'jasmine-headless-webkit' do
  watch(%r{^src/(.*)\.coffee$}) { |m| newest_js_file(spec_location % m[1]) }
  watch(%r{^spec/javascripts/(.*)\.coffee}) { |m| newest_js_file(spec_location % m[1]) }
end

