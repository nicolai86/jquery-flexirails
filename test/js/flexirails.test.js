(function() {
  describe("jquery-flexirails", function() {
    var data, destroyFlexirails, initFlexirails, instance, view;
    instance = null;
    initFlexirails = function(data, view) {
      if (data == null) {
        data = [];
      }
      if (view == null) {
        view = {};
      }
      $("#flexirails").empty();
      return instance = $.flexirails($("#flexirails"), {
        'datasource': data,
        'view': view,
        locales: {}
      });
    };
    destroyFlexirails = function() {
      return instance.destroy();
    };
    it("should export $.flexirails", function() {
      return expect(typeof $.flexirails).toEqual("function");
    });
    describe("flexirails-instanciation", function() {
      beforeEach(function() {
        return initFlexirails();
      });
      afterEach(function() {
        return destroyFlexirails();
      });
      it("should add a table to the page", function() {
        return expect($(".fr-table").length).toBeGreaterThan(0);
      });
      return it("should add a header row to the table", function() {
        return expect($(".fr-header").length).toBeGreaterThan(0);
      });
    });
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
    describe("flexirails-header", function() {
      beforeEach(function() {
        return initFlexirails(data, view);
      });
      afterEach(function() {
        return destroyFlexirails();
      });
      it("should create a td for every column", function() {
        return expect($(".fr-header").children().length).toBe(2);
      });
      return it("should add the attribute as td selector", function() {
        expect($(".city").length).toBeGreaterThan(0);
        return expect($(".country").length).toBeGreaterThan(0);
      });
    });
    return describe("flexirails-column", function() {
      beforeEach(function() {
        return initFlexirails(data, view);
      });
      afterEach(function() {
        return destroyFlexirails();
      });
      return it("should add the attribute as td selector", function() {
        return expect($(".fr-row .city").length).toBeGreaterThan(0);
      });
    });
  });
  describe("flexirails-adapter", function() {
    it("should export Adapter", function() {
      return expect(typeof Adapter).toBe('function');
    });
    return describe("instance", function() {
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
  });
  describe('flexirails-adapter.array', function() {
    it("should export ArrayAdapter", function() {
      return expect(typeof ArrayAdapter).toBe('function');
    });
    return describe('instance', function() {
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
  });
}).call(this);
