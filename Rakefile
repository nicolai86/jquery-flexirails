task :clean do
  sh "rm -fr build"
end

task :concatenate => :clean do 
  sh "mkdir build"
  sh "touch build/concatenated.js"
  ["misc/head.txt","main.js","utils.js","search.js","navigation.js","sorting.js", "ordering.js", "context_menu.js", "localization.js","misc/foot.txt"].each do |file|
    sh "cat src/#{file} >> build/concatenated.js"
  end
end

task :preprocess => :concatenate do
  sh "cpp -P -C -DDEBUG -DPROFILE build/concatenated.js build/preprocessed.js"
end

task :compile => :preprocess do 
  sh "java -jar bin/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js build/preprocessed.js --js_output_file build/compiled.js" 
end

task :build => [:clean, :compile] do
  sh "cp build/compiled.js flexirails.min.js"
  sh "cp build/preprocessed.js flexirails.js"
  Rake::Task["clean"].reenable
  Rake::Task["clean"].invoke
end