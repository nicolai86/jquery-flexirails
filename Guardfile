# watch coffee-script source and recompile the entire project if a single file changes
guard 'shell' do
  watch(%r{^src/coffee/.+\.coffee}) do
    %x{ coffee -j dist/flexirails.js -c src/coffee/plugin.coffee src/coffee/adapter.coffee src/coffee/adapter.array.coffee src/coffee/adapter.remote.coffee }
    p "flexirails compiled."
  end
end
