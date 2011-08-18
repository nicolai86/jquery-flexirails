(function() {
  var $, flexiRow, flexiTable, navigation;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  flexiTable = '<table class="fr-table">\n<tbody>\n  <tr class="fr-header">\n    {{#view/columns}}\n      <td class="{{selector}}">{{title}}</td>\n    {{/view/columns}}\n  </tr>\n</tbody>\n</table>';
  flexiRow = '<tr class="fr-row">\n{{#cells}}\n  <td class="fr-cell {{selector}}">\n    {{value}}\n  </td>\n{{/cells}}\n</tr>';
  navigation = '<div class="fr-navigation">\n<div>\n  <span rel="localize[pagination.resultsPerPage]">Results per Page</span>\n  <select class="fr-per-page">\n    {{#options/perPageOptions}}\n      <option value="{{this}}">{{this}}</option>\n    {{/options/perPageOptions}}\n  </select>\n</div>\n<div>\n  <a href="#" class="fr-first-page">First Page</a>\n  <a href="#" class="fr-prev-page">Prev Page</a>\n  <div>\n    Page <span class="fr-current-page">{{options.currentPage}}</span> of <span class="fr-total-pages">{{totalPages}}</span>\n  </div>\n  <a href="#" class="fr-next-page">Next Page</a>\n  <a href="#" class="fr-last-page">Last Page</a>\n</div>\n<div>\n  <span class="fr-total-results">{{options.entries}}</span> Results\n</div>\n</div>';
  /*
  jquery-flexirails
  Copyright (c) 2011 Raphael Randschau (https://github.com/nicolai86)
  */
  $ = jQuery;
  $.flexirails = function(el, options) {
    var $el, bindNavigation, bindPageNavigation, bindPerPageSelection, buildRowData, compileViews, createNavigation, createTable, defaults, init, plugin, populateTable, prepareView, updateNavigation;
    defaults = {
      paginationOnBottom: true,
      paginationOnTop: true,
      adapter: {
        perPageOptions: [5, 10, 20, 50]
      }
    };
    plugin = this;
    $el = el;
    plugin.settings = {};
    init = function() {
      var data;
      data = $el.data('flexirails');
      plugin.settings = $.extend({}, defaults, options);
      plugin.el = el;
      if (!data) {
        data = {
          'view': options.view
        };
        $el.data('flexirails', data);
        compileViews();
        prepareView();
        createTable();
        plugin.initializeAdapter(options.datasource);
        return createNavigation();
      } else {
        return console.log("initialized");
      }
    };
    prepareView = function() {
      var column, data, view, _i, _len, _ref, _ref2;
      data = $el.data('flexirails');
      view = data.view;
      if (view.hasOwnProperty('columns')) {
        _ref = view.columns;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          column = _ref[_i];
                    if ((_ref2 = column.selector) != null) {
            _ref2;
          } else {
            column.selector = column.attribute;
          };
        }
      }
      data.view = view;
      return $el.data('flexirails', data);
    };
    compileViews = function() {
      var data;
      data = $el.data('flexirails');
      data.createFlexiTable = Handlebars.compile(flexiTable);
      data.createFlexiRow = Handlebars.compile(flexiRow);
      data.createFlexiNavigation = Handlebars.compile(navigation);
      return $el.data('flexirails', data);
    };
    createTable = function() {
      var data;
      data = $el.data('flexirails');
      $el.append(data.createFlexiTable(data));
      return plugin.flexiTable = $el.find('.fr-table');
    };
    createNavigation = function() {
      var data;
      data = $el.data('flexirails');
      if (plugin.settings.paginationOnBottom) {
        $el.append(data.createFlexiNavigation(plugin.adapter));
      }
      if (plugin.settings.paginationOnTop) {
        $(data.createFlexiNavigation(plugin.adapter)).insertBefore(plugin.flexiTable);
      }
      plugin.flexiNavigation = $el.find('.fr-navigation');
      return bindNavigation();
    };
    bindNavigation = function() {
      bindPerPageSelection();
      return bindPageNavigation();
    };
    bindPerPageSelection = function() {
      var perPage;
      perPage = $el.find('.fr-per-page');
      perPage.val(plugin.adapter.options.perPage);
      return perPage.bind('change', function() {
        return plugin.adapter.perPage($(this).val());
      });
    };
    bindPageNavigation = function() {
      var toFirstPage, toLastPage, toNextPage, toPrevPage;
      toFirstPage = $el.find('.fr-first-page');
      toFirstPage.bind('click', function() {
        plugin.adapter.paginateToFirstPage();
        return false;
      });
      toLastPage = $el.find('.fr-last-page');
      toLastPage.bind('click', function() {
        plugin.adapter.paginateToLastPage();
        return false;
      });
      toNextPage = $el.find('.fr-next-page');
      toNextPage.bind('click', function() {
        plugin.adapter.paginateToNextPage();
        return false;
      });
      toPrevPage = $el.find('.fr-prev-page');
      return toPrevPage.bind('click', function() {
        plugin.adapter.paginateToPrevPage();
        return false;
      });
    };
    buildRowData = function(item) {
      var column, data, rowData, _i, _len, _ref;
      data = $el.data('flexirails');
      rowData = [];
      _ref = data.view.columns;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        column = _ref[_i];
        rowData.push({
          value: item[column.attribute],
          selector: column.attribute
        });
      }
      return {
        cells: rowData
      };
    };
    populateTable = function() {
      var adapter, data, item, rowData, table, _i, _len, _ref;
      data = $el.data('flexirails');
      adapter = plugin.adapter;
      table = plugin.flexiTable;
      table.find("tr:not(.fr-header)").remove();
      _ref = adapter.paginatedData();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        rowData = buildRowData(item);
        table.append(data.createFlexiRow(rowData));
        true;
      }
      return updateNavigation();
    };
    updateNavigation = function() {
      var adapter, currentPage, perPage, totalPages, totalResults;
      adapter = plugin.adapter;
      currentPage = $el.find('.fr-current-page');
      currentPage.html(adapter.options.currentPage);
      totalPages = $el.find('.fr-total-pages');
      totalPages.html(adapter.totalPages());
      totalResults = $el.find('.fr-total-results');
      totalResults.html(adapter.options.entries);
      perPage = $el.find('.fr-per-page');
      return perPage.val(adapter.options.perPage);
    };
    plugin.destroy = function() {
      $el.data('flexirails', null);
      $el.find(".fr-table").remove();
      return $el.find(".fr-navigation").remove();
    };
    plugin.initializeAdapter = function(ds) {
      if (ds instanceof Array) {
        plugin.adapter = new ArrayAdapter(ds, plugin.settings.adapter);
      } else {
        plugin.adapter = new RemoteAdapter(ds, plugin.settings.adapter);
      }
      $(plugin.adapter).bind('ready', function() {
        return populateTable();
      });
      return plugin.adapter.paginate(1);
    };
    init();
    return plugin;
  };
  /*
  jquery-flexirails datasource adapter
  Copyright (c) 2011 Raphael Randschau (https://github.com/nicolai86)
  */
  window.Adapter = (function() {
    function Adapter(options) {
      var _base, _base2, _base3, _base4, _ref, _ref2, _ref3, _ref4;
      if (options == null) {
        options = {};
      }
      this.options = options;
            if ((_ref = (_base = this.options).perPage) != null) {
        _ref;
      } else {
        _base.perPage = 5;
      };
            if ((_ref2 = (_base2 = this.options).currentPage) != null) {
        _ref2;
      } else {
        _base2.currentPage = 1;
      };
            if ((_ref3 = (_base3 = this.options).perPageOptions) != null) {
        _ref3;
      } else {
        _base3.perPageOptions = [5, 10, 15, 20, 25];
      };
            if ((_ref4 = (_base4 = this.options).entries) != null) {
        _ref4;
      } else {
        _base4.entries = 0;
      };
      this.data = [];
      this.first = null;
    }
    Adapter.prototype.totalPages = function() {
      return Math.ceil(this.options.entries / this.options.perPage);
    };
    Adapter.prototype.perPage = function(val) {
      this.options.perPage = val;
      return this.paginate(1);
    };
    Adapter.prototype.sort = function(column) {
      return $(this).trigger('ready');
    };
    Adapter.prototype.paginate = function(to) {
      this.options.currentPage = to;
      return $(this).trigger('ready');
    };
    Adapter.prototype.paginatedData = function() {
      return this.data;
    };
    Adapter.prototype.paginationPossible = function(to) {
      return to >= 1 && to <= this.totalPages();
    };
    Adapter.prototype.paginateToFirstPage = function() {
      return this.paginate(1);
    };
    Adapter.prototype.paginateToNextPage = function() {
      return this.paginate(this.options.currentPage + 1);
    };
    Adapter.prototype.paginateToPrevPage = function() {
      return this.paginate(this.options.currentPage - 1);
    };
    Adapter.prototype.paginateToLastPage = function() {
      return this.paginate(this.totalPages());
    };
    return Adapter;
  })();
  window.ArrayAdapter = (function() {
    __extends(ArrayAdapter, Adapter);
    function ArrayAdapter(data, options) {
      if (options == null) {
        options = {};
      }
      ArrayAdapter.__super__.constructor.call(this, options);
      this.options.entries = data.length;
      this.data = data;
      this.paginate(1);
    }
    ArrayAdapter.prototype.sort = function(column, asc) {
      var orderAscending, orderDescending;
      if (asc == null) {
        asc = true;
      }
      orderAscending = function(a, b) {
        if (a[column] < b[column]) {
          return -1;
        } else if (a[column] > b[column]) {
          return 1;
        } else {
          return 0;
        }
      };
      orderDescending = function(a, b) {
        if (a[column] < b[column]) {
          return 1;
        } else if (a[column] > b[column]) {
          return -1;
        } else {
          return 0;
        }
      };
      if (this.data.length > 0) {
        if (asc) {
          this.data.sort(orderAscending);
        } else {
          this.data.sort(orderDescending);
        }
      }
      return ArrayAdapter.__super__.sort.call(this);
    };
    ArrayAdapter.prototype.paginate = function(to) {
      if (this.paginationPossible(to)) {
        this.minIndex = (to - 1) * this.options.perPage;
        this.maxIndex = to * this.options.perPage;
        return ArrayAdapter.__super__.paginate.call(this, to);
      }
    };
    ArrayAdapter.prototype.paginatedData = function() {
      return Array.prototype.slice.call(this.data, this.minIndex, this.maxIndex);
    };
    return ArrayAdapter;
  })();
}).call(this);
