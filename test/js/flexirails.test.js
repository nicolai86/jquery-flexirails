(function() {
  describe("jquery-flexirails", function() {
    it("should export $.flexirails", function() {
      return expect(typeof $.fn.flexirails).toEqual("function");
    });
    describe("flexirails-instanciation", function() {
      beforeEach(function() {
        $("#flexirails").empty();
        return $("#flexirails").flexirails([], {});
      });
      afterEach(function() {
        return $("#flexirails").flexirails('destroy');
      });
      it("should add a table to the page", function() {
        return expect($("#flexirails > .fr-table").length).toBeGreaterThan(0);
      });
      return it("should add a header row to the table", function() {
        return expect($(".fr-header").length).toBeGreaterThan(0);
      });
    });
    return describe("flexirails-header", function() {
      var data, view;
      data = [
        {
          city: 'Kiel',
          country: 'Germany'
        }, {
          city: 'New York',
          country: 'USA'
        }
      ];
      view = {
        columns: [
          {
            title: 'City',
            attribute: 'city'
          }, {
            title: 'Country',
            attribute: 'country'
          }
        ]
      };
      beforeEach(function() {
        $("#flexirails").empty();
        return $("#flexirails").flexirails(data, view);
      });
      afterEach(function() {
        return $("#flexirails").flexirails('destroy');
      });
      it("should create a td for every column", function() {
        return expect($(".fr-header").children().length).toBe(2);
      });
      return it("should set the correct td selector", function() {
        expect($(".city").length).toBeGreaterThan(0);
        return expect($(".country").length).toBeGreaterThan(0);
      });
    });
  });
  describe("flexirails-adapter", function() {
    var adapter;
    adapter = null;
    beforeEach(function() {
      return adapter = new Adapter({});
    });
    afterEach(function() {
      return adapter = new Adapter({});
    });
    it("should have a default perPage value of 5", function() {
      return expect(adapter.options.perPage).toBe(5);
    });
    it("should have a default currentPage value of 1", function() {
      return expect(adapter.options.currentPage).toBe(1);
    });
    it("should change perPage option value when calling perPage", function() {
      adapter.perPage(2);
      return expect(adapter.options.perPage).toBe(2);
    });
    return it("should export paginatedData as a function", function() {
      return expect(typeof adapter.paginatedData).toBe('function');
    });
  });
  describe('flexirails-adapter.array', function() {
    var adapter, data;
    adapter = null;
    data = [
      {
        id: 1,
        name: 'John'
      }, {
        id: 3,
        name: 'Steward'
      }, {
        id: 2,
        name: 'Michael'
      }, {
        id: 4,
        name: 'Ann'
      }
    ];
    beforeEach(function() {
      adapter = new ArrayAdapter(data);
      return this.addMatchers({
        toBeA: function(type) {
          return this.actual instanceof type;
        }
      });
    });
    it("should be instanciable", function() {
      adapter = new ArrayAdapter([]);
      return expect(adapter).toBeA(ArrayAdapter);
    });
    it("should be able to sort data in descending order", function() {
      $(adapter).one('ready', function() {
        expect(adapter.data[0].id).toBe(4);
        return expect(adapter.data[adapter.data.length - 1].id).toBe(1);
      });
      return adapter.sort('id', false);
    });
    it("should be able to sort data in ascending order", function() {
      $(adapter).one('ready', function() {
        expect(adapter.data[0].id).toBe(1);
        return expect(adapter.data[adapter.data.length - 1].id).toBe(4);
      });
      return adapter.sort('id', true);
    });
    it("should fire a ready event when done sorting", function() {
      $(adapter).one('ready', function() {
        return expect(true).toBeTruthy();
      });
      return adapter.sort('name');
    });
    return it("should change paginatedData on perPage call", function() {
      $(adapter).one('ready', function() {
        return expect(adapter.paginatedData().length).toBe(2);
      });
      return adapter.perPage(2);
    });
  });
}).call(this);
