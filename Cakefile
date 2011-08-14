async         = require 'async'
fs            = require 'fs'
{print}       = require 'sys'
{spawn,exec}  = require 'child_process'

build = (output, files) ->  
  options = ['-c', '-j', output]
  
  for file in files 
    options.push file
  
  coffee = spawn 'coffee', options
  coffee.stdout.on 'data', (data) -> print data.toString()
  coffee.stderr.on 'data', (data) -> print data.toString()
  coffee.on 'exit', (status) -> callback?() if status is 0
  
buildSource = ->
  (callback) ->
    build 'dist/flexirails.js', [
      'src/views.coffee', 
      'src/plugin.coffee', 
      'src/adapter.coffee', 
      'src/adapter.array.coffee', 
      'src/adapter.remote.coffee'
    ]
  
buildTests = ->
  (callback) ->
    build 'dist/flexirails.tests.js', [
      'test/flexirails/plugin.test.coffee', 
      'test/flexirails/adapter.test.coffee', 
      'test/flexirails/adapter.array.test.coffee'
    ]
  
task 'build', 'Compile all CoffeeScript source files', ->
  async.parallel [
    buildSource(),
    buildTests()
  ], ->
    console.log "done"