#include "../src/macros.js"

// public flexirails object
var fr = $.fr = {
  formatterFunctions  : {},
  
  viewFinished        : null, // done creating a complete flexirails view
  viewUpdated         : null, // flexirails view settings changed
  currentView         : null,
  rowSelected         : null,
  rowDeselected         : null,
  navigationCreated   : null, // callback when a navigationMenu has been created
  searchCreated       : null, // callback when a searchMenu has been created

  pagination          : {
    last              : 1,
    first             : 1
  },
  
  defaults            : {
    maxResultsPerQuery    : 50,
    perPage               : 25,
    perPageOptions        : [5, 25, 50, 100, 250, -1],
    ghostStyle            :'min-width: 1px; max-width: 1px; width: 1px; border-right: none'
  },
  
  authToken: null,
  
  clientSideCaching   : false // not used yet: client side SQLite caching
};

var setDefaults = fr.setDefaults = function(d) {
  fr = $.fr = $.extend($.fr, d);
};

var fi = $.fi = {
  flexiContainer      : null,
  flexiHeader         : null,
  flexiTable          : null,
  flexiContainerMenu  : null,
  flexiSearchMenu     : null,
  
  requestURL          : null,
  
  hiddenColumns       : new Object(),
  lastClick           : new Date().getTime(),
  loadedRows          : 0,
  appendResults       : false,
  loadingData         : false,
  dontExecuteQueries  : false,
  initializingView    : false,
  selectionEnabled    : true,
  buildFlexiview      : null
}

var publicMethods = {
  authToken : function (val) {
    $.fr.authToken = val;
  },
  
  // Registers an custom cell formatter for a given object-attribute path
  registerFormatter   : function(reflection_path, fnc) {
    $.fr.formatterFunctions[reflection_path] = fnc;
  },
  
  rowSelectedCallback : function(fnc) {
    $.fr.rowSelected = fnc;
  },
  
  rowDeselectedCallback : function(fnc) {
    $.fr.rowDeselected = fnc;
  },
  
  requestOptions: function() {
    return buildFlexiOptions();
  },
  
  // Registers a callback function which is called as soon as the view finished initialization
  viewFinished        : function(fnc, name) {
    if ($.fr.viewFinished == null) {
      $.fr.viewFinished = new Array();
    }
    if (typeof(name) != "undefined") {
      $.fr.viewFinished[name] = fnc;
    } else {
      $.fr.viewFinished.push(fnc);
    }
  },
  
  replaceView         : function(aView) {
    delete $.fr.currentView;
    $(".query_template:not([class*=main])").remove();
    $(":input[name=query_parameter]", $(".query_template")).val('');
    $(":input[name=operator]", $(".query_template")).val('contains');
    $.fr['currentView'] = $.extend({}, aView);
    $.flexirails('invalidateView');
    
    invokeViewUpdated();
  },
  
  navigationCreated   : function(fnc,name) {
    if ($.fr.navigationCreated == null) {
      $.fr.navigationCreated = new Array();
    }
    if (typeof(name) != "undefined") {
      $.fr.navigationCreated[name] = fnc;
    } else {
      $.fr.navigationCreated.push(fnc);
    }
  },
  
  searchCreated       : function(fnc, name) {
    if ($.fr.searchCreated == null) {
      $.fr.searchCreated = new Array();
    }
    if (typeof(name) != "undefined") {
      $.fr.searchCreated[name] = fnc;
    } else {
      $.fr.searchCreated.push(fnc);
    }
  },
  
  // Registers a callback function which is invoked as soon as the view changes
  viewUpdated         : function(fnc, name) {
    if ($.fr.viewUpdated == null) {
      $.fr.viewUpdated = new Array();
    }
    if (typeof(name) != "undefined") {
      $.fr.viewUpdated[name] = fnc;
    } else {
      $.fr.viewUpdated.push(fnc);
    }
  },
  
  // update a row in the current display
  updateRow           : function(obj) {
    var _tr = buildFlexiRow( obj );
    $(".row-"+obj['id'],$.fi.flexiTable).replaceWith(_tr);
    invokeViewUpdated();
  },
  
  createFlexiTable : function () {
    $("#flexitable").remove();
    $.fi.flexiTable      = $(document.createElement('table')).attr('id','flexitable');
    $.fi.flexiHeader     = $(document.createElement('tr')).addClass('header');
    $.fi.flexiTable.append($.fi.flexiHeader);
    $.fi.flexiContainer.append($.fi.flexiTable);
  },
  
  // Applies all view related settings to the current DOM
  invalidateView      : function() {    
    $.fi.dontExecuteQueries = true;
    initializeView();
    
    for (var i = 0; i < $.fr.currentView.cols.length; i++) {
      var col = $.fr.currentView.cols[i];

      if (!col.visible) {
        $.fi.hiddenColumns[col.cacheName] = new Array();
        $.fi.hiddenColumns[col.cacheName][0] = $("th."+col.cacheName).clone();
        $.fi.hiddenColumns[col.cacheName][1] = $("td."+col.cacheName).clone();
        $("td."+col.cacheName+",th."+col.cacheName).remove();
        $("li."+col.cacheName + " > :input").removeAttr('checked'); 
      } else {
        $("li."+col.cacheName + " > :input").attr('checked','checked'); 
      }
    }

    var offset = 0;
    for (var i = 0; i < $.fr.currentView.cols.length; i++) {
      var col = $.fr.currentView.cols[i];
      if (!col.visible) {
        offset++;
        col.real_position = -1;
      } else {
        col.real_position = i - offset;
      }
    }
    
    createContextMenu($.fi.flexiContainerMenu);
    if ($.fr.currentView.hasContextMenu) {
      activateContextMenu();
    }
    if ($.fr.currentView.sortable) {
      flexiheadersSortable();
    }
    
    setViewOptions();

    if ($.fr.currentView.perPage == -1 || $.fr.pagination.last == $.fr.pagination.first || $.fr.currentView.totalResults == 0) {
      $(".pagination.logic").hide();
    } else {
      $(".pagination.logic").show();
    }
    
    restoreSearch();
    $.fi.dontExecuteQueries = false;
    reloadFlexidata();
  }
};

$.flexirails = function(options) {
  if (typeof(options) == 'string') {
    var method = null;
    if (publicMethods.hasOwnProperty(options)) {
      method = publicMethods[options];
      var args = Array.prototype.slice.call(arguments, 1);
      method.apply(this, args);  
    }
    return method;
  }
}

$.fn.flexirails = function(view, url, settings) {
  if (settings.hasOwnProperty('locales')) {
    setLocales(settings.locales);
    delete settings.locales;
  }
  
  $.fr = jQuery.extend($.fr, settings);
  $.fr.currentView = view;
  $.fi.requestURL = url;
  
  return this.each(function() {
    initializeView();
    
    $.fi.flexiContainer  = $(document.createElement('div')).addClass('flexirails');
    
    $.flexirails('createFlexiTable')();

    $.fi.flexiContainerMenu = $(document.createElement('div'));
    createContextMenu($.fi.flexiContainerMenu);
    $(this).append($.fi.flexiContainerMenu);
    
    if ($.fr.currentView.hasContextMenu) {
      activateContextMenu();
    }
    
    $.fi.flexiSearchMenu = $(document.createElement('div')).addClass('search');
    createSearchMenu($.fi.flexiSearchMenu);
    $(this).append($.fi.flexiSearchMenu);
    
    var topNavigation = $(document.createElement('div'));
    createNavigation(topNavigation);
    $(this).append(topNavigation);
    
    $.fi.flexiContainer.append($.fi.flexiTable);
    $(this).append($.fi.flexiContainer);
    
    var bottomNavigation = $(document.createElement('div'));
    createNavigation(bottomNavigation);
    $(this).append(bottomNavigation);

    flexiheadersSortable();
    
    $.flexirails('invalidateView');
    return this;
  });
}

function initializeView() {
  $.fi.initializingView = true;
  
  $.fr.currentView.visibleColumnCount = 0;
  for (var i = 0; i < $.fr.currentView.cols.length; i++) {
    var c = $.fr.currentView.cols[i];

    c.cacheName = c.reflectionPath.replace(/\./g,'_');
    c.visible = (c.visible == "true") || (c.visible == true);
    c.real_position = i;
    
    $.fr.currentView.visibleColumnCount += c.visible ? 1 : 0;
  }

  if (!$.fr.currentView.hasOwnProperty('order')) {
    $.fr.currentView.order = {by:null, direction:null};
  }

  if (!$.fr.currentView.hasOwnProperty('totalResults')) {
    $.fr.currentView.totalResults = 1; 
  }
  $.fr.currentView.hasContextMenu = true;
  
  if ($.fr.currentView.hasOwnProperty('current_page')) {
    $.fr.currentView.currentPage = $.fr.currentView.current_page;
    delete $.fr.currentView.current_page;
  }
  $.fr.currentView.currentPage = $.fr.currentView.hasOwnProperty('currentPage') ? parseInt($.fr.currentView.currentPage) : 1;
  
  if ($.fr.currentView.hasOwnProperty('per_page')) {
    $.fr.currentView.perPage = $.fr.currentView.per_page;
    delete $.fr.currentView.per_page;
  }
  $.fr.currentView.perPage = $.fr.currentView.hasOwnProperty('perPage') ? parseInt($.fr.currentView.perPage) : $.fr.defaults.perPage;
  
  if (!($.fr.currentView.operators instanceof Array)) {
    var ops = new Array();
    for (var key in $.fr.currentView.operators) {
      ops.push($.fr.currentView.operators[key]);
    }
    delete $.fr.currentView.operators;
    $.fr.currentView['operators'] = ops;
  }
  
  if (!$.fr.currentView.hasOwnProperty('sort')) {
    $.fr.currentView.sort = {
      by : null,
      direction : 'asc',
      reflectionPath : ''
    }
  } else {
    $.fr.currentView.sort.by = $.fr.currentView.sort.hasOwnProperty('by') ? $.fr.currentView.sort.by : null;
    $.fr.currentView.sort.direction = $.fr.currentView.sort.hasOwnProperty('direction') ? $.fr.currentView.sort.direction : 'asc';
    $.fr.currentView.sort.reflectionPath = $.fr.currentView.sort.hasOwnProperty('reflectionPath') ? $.fr.currentView.sort.reflectionPath : '';
  }
  
  if ($.fr.currentView.sortable == 'true') {
    $.fr.currentView.sortable = true;
  }
  
  if ($.fr.currentView.hasOwnProperty('has_contextmenu')) {
    $.fr.currentView.hasContextMenu = $.fr.currentView.has_contextmenu == 'true';
    delete $.fr.currentView.has_contextmenu;
  }
  
  $.fi.initializingView = false;
}

function appendFlexiData() {
  if (($.fr.currentView.perPage * ($.fr.currentView.currentPage - 1) + $.fi.loadedRows) < $.fr.currentView.totalResults) {
    $.fi.appendResults = true;
    
    var limit = $.fr.defaults.maxResultsPerQuery;
    if ($.fr.currentView.perPage > 0) {
      limit = Math.min( $.fr.defaults.maxResultsPerQuery, $.fr.currentView.perPage - $.fi.loadedRows )
    }
    
    LOG( "(flexirails) appending data ..." + (new Date()) )
    
    $.ajax({
      type: 'GET',
      url: $.fi.requestURL,
      data: buildFlexiOptions({}, {
        limit: limit,
        offset: $.fi.loadedRows
      }),
      success: buildFlexiview,
      dataType: 'json'
    });
  }
}

function showLoadingInfo() {
  $("#flexitable").remove();
};

function reloadFlexidata() {  
  if ($.fi.requestURL == null || $.fi.dontExecuteQueries || $.fi.initializingView || $.fi.loadingData) {
    return;
  }

  $(".js-fr-from-page").attr('disabled','disabled');

  $.fi.hiddenColumns = new Object();
  
  LOG( "(flexirails) reloading data ..." + (new Date()) )
  
  $.ajax({
    type: 'GET',
    url: $.fi.requestURL,
    data: buildFlexiOptions(),
    success: buildFlexiview,
    dataType: 'json'
  });

  $.fi.loadingData = true;
  $.fi.appendResults = false;
}

function invokeViewFinished() {
  if ($.fr.viewFinished != null) {
    for (var i=0; i < $.fr.viewFinished.length; i++) {
      $.fr.viewFinished[i].call(this);
    }
  }  
  for (var prop in $.fr.viewFinished) {
    if ($.fr.viewFinished.hasOwnProperty(prop)) {
      $.fr.viewFinished[prop].call(this);
    }
  }  
  if ( $.fi.selectionEnabled ) {
    setupSelection();
  }
}

function invokeViewUpdated() {
  if ($.fr.viewUpdated != null && !$.fi.initializingView && !$.fi.dontExecuteQueries) {
    for (var i=0; i < $.fr.viewUpdated.length; i++) {
      $.fr.viewUpdated[i].call(this);
    }
  }
  for (var prop in $.fr.viewUpdated) {
    if ($.fr.viewUpdated.hasOwnProperty(prop)) {
      $.fr.viewUpdated[prop].call(this);
    }
  }
  if ( $.fi.selectionEnabled ) {
    setupSelection();
  }
}

function reloadFlexiView() {
  var q_params = $(":input[name=query_parameter]");
  var q_ops = $(":input[name=operator]");
  var q_attrs = $(":input[name=attributes]");
  var query = new Object();

  for (var i = 0; i < q_params.length; i++) {
    var q = $(q_params[i]).val();
    if ($.trim(q) != "") {
      query[i] = {
        attribute: $(q_attrs[i]).val(),
        operator: $(q_ops[i]).val(),
        value: q
      };
    }
  }
}

function setViewOptions() {
  $(".total_results").html($.fr.currentView.totalResults);
  $(".js-fr-from-page").val($.fr.currentView.currentPage);
  $(".to").html($.fr.pagination.last);
  $(":input[name=per_page]").val($.fr.currentView.perPage);
}

function setFlexirailsOptions(data) {
  if ($.fi.appendResults) {
    return;
  }

  $.fr.pagination.last = Math.ceil($.fr.currentView.totalResults / ($.fr.currentView.perPage == -1 ? data.total : $.fr.currentView.perPage));
  $.fr.currentView.currentPage = data["currentPage"];
  
  setViewOptions();
  
  $.fi.dontExecuteQueries = true;
  if (data['query'].hasOwnProperty('operators')) {
    var ops   = data['query']['operators'];
    var attrs = data['query']['attributes'];
    var vals  = data['query']['values'];
    
    $(".query_template:not([class*=main])").remove();
    var first = true;
    for (var i=0; i < ops.length; i++) {
      var container;
      if (first) {
        first = false;
        container = $('.query_template.main');
      } else {
        container = duplicateAndAppendQueryTemplate();
      }
      
      $(":input[name=attributes]", container).val(attrs[i]);
      $(":input[name=operator]", container).val(ops[i]);
      $(":input[name=query_parameter]", container).val(vals[i]);
    }
    
    updateViewQuery();
  }
  $.fi.dontExecuteQueries = false;

  if ($.fr.currentView.perPage == -1 || $.fr.pagination.last == $.fr.pagination.first) {
    $(".pagination.logic").hide();
  } else {
    $(".pagination.logic").show();
  }
}

function switchFlexiheaders(from, to, col) {
  var parts = $.fr.currentView.cols.splice(Math.min(from, to), Math.abs(from - to) + 1);

  if (from < to) {
    var tmp = parts.shift();
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].visible) {
        $("td."+col.cacheName+",li."+col.cacheName).moveRight();
      }
    }
    parts.push(tmp);

  } else {
    var tmp = parts.pop();
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].visible) {
        $("td."+col.cacheName+",li."+col.cacheName).moveLeft();
      }
    }    
    parts.unshift(tmp);
  }

  for (var i = 0; i < parts.length; i++) {
    $.fr.currentView.cols.splice(Math.min(from, to) + i, 0, parts[i]);
  }
}

function buildDefaultFlexiCell(td, obj, col, val) {
  td.attr('class', col.cacheName);

  if (val == undefined || val == null || val.length == 0) {
    val = "-";
    td.addClass('center');
  }

  td.append(val);
}

function updateRealColumnPositions() {
  var offset = 0;
  for (var i = 0; i < $.fr.currentView.cols.length; i++) {
    var col = $.fr.currentView.cols[i];
    if (!col.visible) {
      offset++;
      col.real_position = -1;
    } else {
      col.real_position = i - offset;
    }
  }
}

function findNextVisibleColumn(cursor) {
  var rightVisible, leftVisible, returnCursor;
  rightVisible = leftVisible = returnCursor = -1;

  for (var i = cursor + 1; i < $.fr.currentView.cols.length; i++) {
    if ($.fr.currentView.cols[i].visible) {
      rightVisible = i;
      returnCursor = rightVisible;
      break;
    }
  }

  for (var i = cursor - 1; i >= 0; i--) {
    if ($.fr.currentView.cols[i].visible) {
      leftVisible = i;
      if (rightVisible == -1 || Math.abs(rightVisible - cursor) > Math.abs(leftVisible - cursor)) {
        returnCursor = leftVisible;
      }
      break;
    }
  }

  return returnCursor;
}

function appendClasses(td, index, col) {
  if (index == 0) {
    td.addClass('first');
  } else if (index == $.fr.currentView.cols.length-1) {
    td.addClass('last');
  }
  if (col.cacheName == $.fr.currentView.reflectionPath) {
    td.addClass('sorted');
  }
  return td.addClass(col.cacheName);
}

function buildFlexiview(data, textStatus, XMLHttpRequest) {
  $.flexirails('createFlexiTable')();
  
  TIME("build flexirails view")
  $.fr.currentView.totalResults = parseInt(data.total) || 0;
  
  setFlexirailsOptions(data);
  
  if (!$.fi.appendResults) {
    $.fi.loadedRows = 0;
    $(".flexirow").remove();
    $.fi.flexiHeader.children().remove();

    for (var i = 0; i < $.fr.currentView.cols.length; i++) {
      var col = $.fr.currentView.cols[i];
      if (col.onlySearchable) {
        continue;
      }
      var th = $(document.createElement('th')).addClass(col.cacheName).addClass('sortable').append(col.title);
      if (col.visible) {
        $.fi.flexiHeader.append(th);
      } else {
        $.fi.hiddenColumns[col.cacheName] = new Array();
        $.fi.hiddenColumns[col.cacheName][0] = th;
      }
    }
    $.fi.flexiHeader.append($(document.createElement('th')).attr('style', $.fr.defaults.ghostStyle));

    if ($.fr.currentView.sort.reflectionPath != '') {
      $("th."+$.fr.currentView.sort.reflectionPath).addClass("sorted");
      $("th."+$.fr.currentView.sort.reflectionPath).addClass($.fr.currentView.sort.direction);
    }
  }
  
  var arr = data.rows; 
  for (var i = 0; i < $.fr.currentView.cols.length; i++) {
    if (!$.fr.formatterFunctions.hasOwnProperty($.fr.currentView.cols[i].cacheName)) {
      $.fr.formatterFunctions[$.fr.currentView.cols[i].cacheName] = buildDefaultFlexiCell;
    }
  }

  $.fi.loadedRows += arr.length;
  var cur_req = Math.round($.fi.loadedRows / $.fr.defaults.maxResultsPerQuery);

  if (arr.length == 0) {
    $.fi.flexiHeader.next().remove();
    var _tr = $(document.createElement('tr')).addClass('no_results');
    _tr.append($(document.createElement('td')).addClass('center').attr('colspan', $.fr.currentView.visibleColumnCount + 1).append('Keine Einträge vorhanden'));
    $.fi.flexiTable.append(_tr);
  } else {
    $.fi.flexiTable.find(".no_results").remove();
  }

  var parent = $.fi.flexiTable.parent();
  $.fi.flexiTable.detach();
  for (var i = 0; i < arr.length; i++) { 
    var obj = arr[i];
    var _tr = buildFlexiRow( obj );
    $.fi.flexiTable.append(_tr);
  }
  parent.append($.fi.flexiTable);

  setupFirstLastColumns();
  setupOrderByColumns();
  invokeViewFinished();
  
  $.fi.loadingData = false;
  
  if (($.fi.loadedRows < $.fr.currentView.perPage || $.fr.currentView.perPage == -1) && $.fi.loadedRows < $.fr.currentView.totalResults) {
    appendFlexiData();
    if ($.fr.currentView.currentPage == $.fr.pagination.last) {
      $(".js-fr-from-page").removeAttr('disabled');
    }
  } else {
    $.fi.appendResults = false;
    $(".js-fr-from-page").removeAttr('disabled');
  }
  TIME_END()
}

function buildFlexiRow(obj) {
  var _tr = $(document.createElement('tr'));
  _tr.addClass('flexirow');
  
  if (obj.hasOwnProperty('id')) {
    _tr.addClass('row-' + obj['id']);
  }

  for (var j = 0; j < $.fr.currentView.cols.length; j++) { 
    var col = $.fr.currentView.cols[j];
    if (col.onlySearchable) {
      continue;
    }
    
    var td = $(document.createElement('td'));
    $.fr.formatterFunctions[col.cacheName](td, obj, col, $.extractAttribute(obj, col.reflectionPath));
    appendClasses(td, j, col);
    
    if (col.visible) {
      _tr.append(td);
    } else {
      if ($.fi.hiddenColumns[col.cacheName][1] == null) {
        $.fi.hiddenColumns[col.cacheName][1] = td;
      } else {
        $.fi.hiddenColumns[col.cacheName][1].push(td);
      }
    }
  }

  _tr.append($(document.createElement('td')).attr('style',$.fr.defaults.ghostStyle));
  return _tr;
}

function buildFlexiOptions(options, override) {
  var opts = new Object();
  opts["flexirails"] = "index";

  $.extend(opts,options);
  opts["pagination"] = new Object();
  opts["pagination"]["current_page"] = $.fr.currentView.currentPage;
  opts["pagination"]["per_page"] = $.fr.currentView.perPage;

  opts["limit"] = $.fr.defaults.maxResultsPerQuery;
  opts["offset"] = 0

  opts["order"] = orderByOptions();

  updateViewQuery();
  if (!$.isEmptyObject($.fr.currentView.search.query)) {
    opts["query"]       = $.fr.currentView.search.query;
    opts["search_all"]  = $.fr.currentView.search.searchAll;
    opts["flexirails"]  = "search";
  }
  
  if ( $.fr.authToken ) {
    opts["authenticity_token"] = $.fr.authToken;
  }
  
  $.extend(opts, override);
  return opts;
}
