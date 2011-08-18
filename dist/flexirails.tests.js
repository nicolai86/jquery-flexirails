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
      }, {
        city: 'Oklahoma',
        country: 'USA'
      }, {
        city: 'London',
        country: 'UK'
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
        return expect($(".fr-header").children().length).toBe(view.columns.length);
      });
      return it("should add the attribute as td selector", function() {
        expect($(".city").length).toBeGreaterThan(1);
        return expect($(".country").length).toBeGreaterThan(1);
      });
    });
    describe("flexirails-column", function() {
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
    return describe("flexirails-navigation", function() {
      beforeEach(function() {
        initFlexirails(data, view);
        return instance.adapter.perPage(2);
      });
      afterEach(function() {
        return destroyFlexirails();
      });
      it("should display the total number of entries", function() {
        return expect($('.fr-total-results').html()).toBe(instance.adapter.options.entries.toString());
      });
      it("should display the correct currentPage", function() {
        return expect($(".fr-current-page").html()).toBe(instance.adapter.options.currentPage.toString());
      });
      it("should display the correct totalPage", function() {
        return expect($(".fr-total-pages").html()).toBe(instance.adapter.totalPages().toString());
      });
      it("should display the correct page count after perPage is called", function() {
        instance.adapter.paginate(2);
        return expect($(".fr-current-page").html()).toBe('2');
      });
      it("should display the correct total pages counter after perPage is called", function() {
        instance.adapter.perPage(3);
        return expect($(".fr-total-pages").html()).toBe('2');
      });
      it("should paginate when next link is clicked", function() {
        $(".fr-next-page").click();
        return expect(instance.adapter.options.currentPage).toBe(2);
      });
      it("should paginate to last page when last page is clicked", function() {
        $(".fr-last-page").click();
        return expect(instance.adapter.options.currentPage).toBe(instance.adapter.totalPages());
      });
      return it("should paginate to currentPage when clicking next-prev", function() {
        var page;
        page = instance.adapter.options.currentPage;
        $(".fr-next-page").click();
        $(".fr-prev-page").click();
        return expect(instance.adapter.options.currentPage).toBe(page);
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
      it("should export paginatedData as a function", function() {
        return expect(typeof adapter.paginatedData).toBe('function');
      });
      it("should export totalPages as a function", function() {
        return expect(typeof adapter.totalPages).toBe('function');
      });
      describe("per-page", function() {
        it("should change options.perPage value when calling perPage", function() {
          adapter.perPage(2);
          return expect(adapter.options.perPage).toBe(2);
        });
        it("should fire a ready event when perPage is changed", function() {
          $(adapter).one('ready', function() {
            return expect(true).toBeTruthy();
          });
          return adapter.perPage(2);
        });
        return it("should change options.currentPage to 1 when changing perPage", function() {
          adapter.options.currentPage = 2;
          adapter.perPage(2);
          return expect(adapter.options.currentPage).toBe(1);
        });
      });
      describe("sorting", function() {
        return it("should fire a ready event when sort is called", function() {
          $(adapter).one('ready', function() {
            return expect(true).toBeTruthy();
          });
          return adapter.sort({});
        });
      });
      return describe("pagination", function() {
        it("should fire a ready event when paginate is called", function() {
          $(adapter).one('ready', function() {
            return expect(true).toBeTruthy();
          });
          return adapter.paginate(2);
        });
        it("should change options.currentPage value when paginate is called", function() {
          adapter.paginate(2);
          return expect(adapter.options.currentPage).toBe(2);
        });
        it("should have a paginateToFirstPage function", function() {
          return expect(typeof adapter.paginateToFirstPage).toBe('function');
        });
        it("should have a paginateToNextPage function", function() {
          return expect(typeof adapter.paginateToNextPage).toBe('function');
        });
        it("should update options.currentPage when paginateToNextPage is called", function() {
          expect(adapter.options.currentPage).toBe(1);
          adapter.paginateToNextPage();
          return expect(adapter.options.currentPage).toBe(2);
        });
        it("should have a paginateToPrevPage function", function() {
          return expect(typeof adapter.paginateToPrevPage).toBe('function');
        });
        it("should update options.currentPage when paginateToPrevPage is called", function() {
          adapter.paginate(2);
          expect(adapter.options.currentPage).toBe(2);
          adapter.paginateToPrevPage();
          return expect(adapter.options.currentPage).toBe(1);
        });
        it("should have a paginationPossible function", function() {
          return expect(typeof adapter.paginationPossible).toBe('function');
        });
        return it("should not be possible to paginate belog page 1", function() {
          return expect(adapter.paginationPossible(0)).toBeFalsy();
        });
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
      describe("pagination", function() {
        it("should have the correct totalPages count", function() {
          return expect(adapter.totalPages()).toBe(1);
        });
        it("should have the correct totalPages count for multiples of perPage", function() {
          adapter.perPage(2);
          return expect(adapter.totalPages()).toBe(2);
        });
        return it("should have the correct totalPages count for odds of perPage", function() {
          adapter.perPage(3);
          return expect(adapter.totalPages()).toBe(2);
        });
      });
      describe("sorting", function() {
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
        return it("should fire a ready event when done sorting", function() {
          $(adapter).one('ready', function() {
            return expect(true).toBeTruthy();
          });
          return adapter.sort('name');
        });
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
