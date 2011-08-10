# watch coffee-script source and recompile the entire project if a single file changes
guard 'shell' do
  watch(%r{^src/coffee/.+\.coffee}) do
    %x{ coffee -j dist/flexirails.js -c src/coffee/views.coffee src/coffee/plugin.coffee src/coffee/adapter.coffee src/coffee/adapter.array.coffee src/coffee/adapter.remote.coffee }
    "#{Time.now.strftime "%H:%M"} : flexirails compiled."
  end
  
  watch(%r{^test/flexirails/.+\.coffee}) do |m|
    %x{ coffee -j test/js/flexirails.test.js -c test/flexirails/plugin.test.coffee test/flexirails/adapter.test.coffee test/flexirails/adapter.array.test.coffee }
    "#{Time.now.strftime "%H:%M"} : flexirails tests compiled."
  end
end
