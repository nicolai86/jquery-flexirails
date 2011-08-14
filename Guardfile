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
