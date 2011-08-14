# flexirails

flexirails is an easy to use table plugin for jQuery, which supports features like 
searching, pagination, custom column ordering and much much more out of the box. 
The plugin is fully tested and written in CoffeeScript.

## Running the tests

To execute the test suite you should be 

  - running RVM, 
  - Ruby 1.9.2 or higher
  - Node 0.4.10 or higher
  - Node Package Manager
  - and Pow. 

Then all you have to do is 

  1. clone the project, 
  2. run `cake build` to compile the CoffeeScript source
  3. create a pow-domain for it 
  4. and visit http://your-flexirails-pow-domain.dev/test/index.html.
  
All tests are loaded automatically and executed.

## Please Note

- The plugin is currently being rewritten using coffeescript, to achieve proper seperation of concerns, cleaner code and js lint compliance