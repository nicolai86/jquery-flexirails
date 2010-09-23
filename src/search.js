function createSearchMenu(container) {
  container.children().remove();
  
  if (!$.fr.hasOwnProperty('searchTemplate')) {
    $.fr.searchTemplateSource = '<fieldset class="mb">'+
      '<legend>{{locales/title}}</legend>'+
      '<input id="search_all" name="search_all" type="checkbox" value="1">'+
      '<label for="search_all" style="display:block;">{{locales/meetAllCriteria}}</label>'+
      '<div class="clear"></div>'+
      '<div style="display: inline;" class="query_template main">'+
        '<select id="attributes" name="attributes">'+
          '{{#attributes}}'+
            '<option value="{{reflectionPath}}">{{title}}</option>'+
          '{{/attributes}}'+
        '</select>'+
        '<select id="operator" name="operator">'+
          '{{#operators}}'+
            '<option value="{{value}}">{{label}}</option>'+
          '{{/operators}}'+
        '</select>'+
        '<input id="query_parameter" name="query_parameter" type="text">'+
        '<input name="remove_query_condition" type="submit" value="{{locales/removeParameter}}" style="width: 28px;">'+
        '<input name="add_query_condition" style="width: 28px" type="submit" value="{{locales/addParameter}}">'+
        '<div class="clear"></div>'+
      '</div>'+
      '<div class="js-query-insert"></div>'+
      '<input name="submit_query" type="submit" value="{{locales/search}}">'+
      '<input name="reset_query" type="submit" value="{{locales/reset}}" style="color:red;">'+
    '</fieldset>';
    
    $.fr.searchTemplate = Handlebars.compile($.fr.searchTemplateSource);
  }
  
  var attributes = [];
  for (var i=0; i < $.fr.currentView.cols.length; i++) {
    if ($.fr.currentView.cols[i].searchable) {
      attributes.push($.fr.currentView.cols[i]);
    }
  }

  attributes.sort(function sortColumns(a, b) {
    if (a.title == b.title) {
      return 0;
    }
    return (a.title < b.title) ? -1 : 1;
  });
  
  var data = {
    "locales" : {
      "title"               : $.t('search.title'),
      "meetAllCriteria"     : $.t('search.meetAllCriteria'),
      "addParameter"        : $.t('actions.addParameter'),
      "removeParameter"     : $.t('actions.removeParameter'),
      "search"              : $.t('actions.search'),
      "reset"               : $.t('actions.clearSearch')
    },
    "operators"       : $.fr.currentView.operators,
    "attributes"      : attributes
  };
  
  var search = $.fr.searchTemplate(data);
  delete attributes;
  
  container.append(search);
  addSearchMenuEventHandlers(container);
  
  $(':input[name=reset_query]',container).click(function() {
    clearQuery(true);
    reloadFlexidata();
    return false;
  });
  $(':input[name=submit_query]',container).click(function() {
    searchFlexidata();
    return false;
  });
  
  invokeSearchCreated(container);
}

function duplicateAndAppendQueryTemplate() {
  var clone = $('.query_template.main').clone();
  $(clone).removeClass("main")
  
  $(":input[name=query_parameter]",clone).val('');
  if ($('.query_template').length == 1) {
    $('.js-query-insert').after(clone);
  } else {
    $('.query_template:last').after(clone);
  }
  
  addSearchMenuEventHandlers(clone);
  return clone;
}

function removeQuery(container) {
  if (!$(container).parent().hasClass("main")) {
    $(container).parent().remove();
  }
  updateViewQuery();
  invokeViewUpdated();
}

function updateViewQuery() {
  var params = $(":input[name=query_parameter]");
  var ops = $(":input[name=operator]");
  var attrs = $(":input[name=attributes]");
  
  var query = new Object();
  for (var i = 0; i < params.length; i++) {
    var q = $.trim($(params[i]).val());
    if (q.length > 0 || $(ops[i]).val() == 'is_null' || $(ops[i]).val() == 'is_not_null') {
      query[i] = {
        attribute: $(attrs[i]).val(),
        operator: $(ops[i]).val(),
        value: q
      }
    }
  }

  $.fr.currentView.search = {
    query: query,
    searchAll: $(":input[name=search_all]").attr('checked')
  }
}

function clearQuery(invokeUpdated) {
  $(".query_template:not([class*=main])").remove();
  $(":input[name=query_parameter]", $(".query_template")).val('');
  $(":input[name=operator]", $(".query_template")).val('contains');
  
  updateViewQuery();
  if (invokeUpdated == true) {
    invokeViewUpdated();
  }
}

function searchFlexidata() {
  $.fr.currentView.currentPage = 1;
  $(".js-fr-from-page").val($.fr.currentView.currentPage);
  
  $.get($.fi.requestURL, buildFlexiOptions(), buildFlexiview, "json");
  invokeViewUpdated();
}

function updateQuery(event) {
  var key = window.event ? window.event.keyCode : event.which;
  if (key == 13) {
    searchFlexidata();
  }
}

function restoreSearch() {
  if ($.fr.currentView.hasOwnProperty('search')) {
    if ($.fr.currentView.search.searchAll == "true" || $.fr.currentView.search.searchAll == true) {
      $(":input[name=search_all]").attr('checked', 'checked')
    } else {
      $(":input[name=search_all]").removeAttr('checked')
    }
    
    if ($.fr.currentView.search.hasOwnProperty('query')) {

      var query = $.fr.currentView.search.query;
      clearQuery(false);
      var first = true;
      for (var key in query) {
        var q = query[key];
        var container;
        if (first) {
          first = false;
          container = $('.query_template.main');
        } else {
          container = duplicateAndAppendQueryTemplate();
        }
    
        $("#attributes", container).val(q.attribute);
        $("#operator", container).val(q.operator);
        $("#query_parameter", container).val(q.value);
      }
    }
    
    updateViewQuery();
  }
}

function addSearchMenuEventHandlers(container) {
  $('input[name=query_parameter]', container).keypress(updateQuery);
  
  $('input[name=remove_query_condition]',container).bind('click',function removeQueryCondition() {
    removeQuery(this);
    return false;
  });
  
  $('input[name=add_query_condition]',container).bind('click',function addQueryCondition() {
    duplicateAndAppendQueryTemplate(); 
    return false;
  });
}

function invokeSearchCreated(container) {
  if ($.fr.searchCreated != null) {
    for (var i=0; i < $.fr.searchCreated.length; i++) {
      $.fr.searchCreated[i].apply(this, [container]);
    }
  }
}
