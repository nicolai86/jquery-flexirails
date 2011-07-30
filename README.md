# flexirails

flexirails is an easy to use table plugin for jQuery, which supports features like 
searching, pagination, custom column ordering and much more out of the box.

## Requirements

jQuery.flexirails works with jQuery >= 1.4.2, Handlebar.js and requires a server-side backend. Checkout the [Ruby on Rails plugin](http://github.com/nicolai86/flexirails).

## building jQuery.flexirails

Checkout the project, fire up a terminal, cd into the project path and enter

    ant clean distribute
      
You're done! The build is placed under ./dist .

## ToDo

- rewrite using coffeescript (achieve proper js lint, seperation of concerns, ...)
- add qunit tests
- possiblity to work with JS Arrays as well as remote datasources