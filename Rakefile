
begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end

desc "Removes all old build and distribution files"
task :clean do
  sh "rm -fr build dist"
end

desc "Concatenates all JavaScript files into one"
task :concatenate => :clean do 
  sh "mkdir build"
  sh "touch build/concatenated.js"
  ["misc/head.txt","main.js","utils.js","selection.js","search.js","navigation.js","sorting.js", "ordering.js", "context_menu.js", "localization.js","misc/foot.txt"].each do |file|
    sh "cat src/#{file} >> build/concatenated.js"
  end
end

desc "Runs the C preprocessor to allow usage of macros inside javascript"
task :preprocess => :concatenate do
  # -DPROFILE -DDEBUG
  sh "cd build && cpp -P -C concatenated.js preprocessed.js"
end

desc "Minifies the JavaScript for deployment"
task :compile => :preprocess do 
  sh "java -jar bin/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js build/preprocessed.js --js_output_file build/compiled.js" 
end

desc "Builds flexirails JavaScript"
task :build => [:clean, :compile] do
  sh "mkdir dist"
  sh "cp build/compiled.js dist/flexirails.min.js"
  sh "cp build/preprocessed.js dist/flexirails.js"
end