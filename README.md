# flexirails

flexirails is an easy to use table plugin for jQuery, which supports features like 
searching, pagination, custom column ordering and much much more out of the box. 
The plugin is fully tested and written in CoffeeScript.

## Running the tests

To execute the test suite you should run

  1. `bundle install`
  2. `jasmine-headless-webkit` or `guard start`
  
All tests are loaded automatically and executed in order.  

Please note that in order to run the testing suite you have to install all dependencies:
 
  - jasmine-headless-webkit
  - Ruby (RVM).
  
Installation instructions for jasmine-headless-webkit and ruby can be found on the respective project homepages.

## Please Note

- The plugin is currently being rewritten using coffeescript, to achieve proper seperation of concerns, cleaner code and js lint compliance