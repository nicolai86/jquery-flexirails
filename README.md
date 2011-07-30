# flexirails

flexirails is an easy to use table plugin for jQuery, which supports features like 
searching, pagination, custom column ordering and much more out of the box.

## Requirements

jQuery.flexirails works with jQuery >= 1.4.2, Handlebar.js and requires a server-side backend. Checkout the [Ruby on Rails plugin](http://github.com/nicolai86/flexirails).

## building jQuery.flexirails

Checkout the project, fire up a terminal, cd into the project path and enter

    ant clean distribute
      
You're done! The build is placed under ./dist .

## Running the tests

To execute the test suite you should be 

  - running RVM, 
  - Ruby 1.8.7 or higher
  - and Pow. 

Then all you have to do is 

  1. clone the project, 
  2. create a pow-domain for it 
  3. and visit http://your-flexirails-pow-domain.dev/test/index.html.
  
All tests are loaded automatically and executed.

## ToDo

- rewrite using coffeescript (achieve proper js lint, seperation of concerns, ...)
- add qunit tests
- possiblity to work with JS Arrays as well as remote datasources