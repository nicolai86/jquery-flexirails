fs            = require 'fs'
{print}       = require 'sys'
{spawn,exec}  = require 'child_process'

#
# handle builds using the Node.js coffee command
#
build = (output, files) ->  
  options = ['-c', '-j', output]
  
  for file in files 
    options.push file
  
  coffee = spawn 'coffee', options
  coffee.stdout.on 'data', (data) -> print data.toString()
  coffee.stderr.on 'data', (data) -> print data.toString()
  coffee.on 'exit', (status) -> callback?() if status is 0

#  
# build a single JavaScript file from all CoffeeScript source files
#
buildSource = ->
  build 'dist/flexirails.js', [
    'src/views.coffee', 
    'src/column.coffee', 
    'src/plugin.coffee', 
    'src/adapter.coffee', 
    'src/adapter.array.coffee', 
    'src/adapter.remote.coffee'
  ]
  
#
# Minify the JavaScript file using googles closure compiler
#
minifyBuild = ->
  options = ['--js', 'dist/flexirails.js', '--js_output_file', 'dist/flexirails.min.js']
  compiler = spawn 'closure', options
  compiler.stdout.on 'data', (data) -> print data.toString()
  compiler.stderr.on 'data', (data) -> print data.toString()
  compiler.on 'exit', (status) -> callback?() if status is 0
  
  
task 'build', 'Compile all CoffeeScript source files', ->
  buildSource()
  console.log "done building"
  
task 'minify', 'Minify the build JavaScript source file', ->
  minifyBuild()
  console.log "done minifying"