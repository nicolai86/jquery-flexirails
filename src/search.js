function createSearchMenu(container) {
  container.children().remove();
  var fieldset = $(document.createElement('fieldset')).attr({'class' : 'mb'});
  var searchLegend = $(document.createElement('legend')).append($.t('search.title'));
  fieldset.append(searchLegend);
  var searchAll = $(document.createElement('input')).attr({id:'search_all',name:'search_all',type:'checkbox',value:'1'});
  fieldset.append(searchAll);
  var searchAllLabel = $(document.createElement('label')).attr({'for':'search_all','style':'display:block;'}).append($.t('search.meetAllCriteria'));
  fieldset.append(searchAllLabel);
  fieldset.append($(document.createElement('div')).attr({'class' : 'clear'}));

  var attributes = [];
  for (var i=0; i < $.fr.currentView.cols.length; i++) {
    attributes.push($.fr.currentView.cols[i]);
  }
  
  attributes.sort(function(a, b) {
    if (a.title == b.title) {
      return 0;
    }
    return (a.title < b.title) ? -1 : 1;
  });
  
  var queryTemplate = $(document.createElement('div')).attr({style : 'display: inline;', 'class' : 'query_template main'});
  var selectTag = $(document.createElement('select')).attr({id : 'attributes', name : 'attributes'});
  for (var i=0; i < attributes.length; i++) {
    var col = attributes[i];
    selectTag.append($('<option value="'+col.reflectionPath+'">'+col.title+'</option>'))
  };
  
  delete attributes;
  
  queryTemplate.append(selectTag).append(' ');
  var operatorTag = $(document.createElement('select')).attr({id : 'operator', name : 'operator'});
  for (var i=0; i < $.fr.currentView.operators.length; i++) {
    var operator = $.fr.currentView.operators[i];
    operatorTag.append($('<option value="'+operator.value+'">'+operator.label+'</option>'))
  };
  queryTemplate.append(operatorTag).append(' ');
  fieldset.append(queryTemplate);

  var queryParameter = $(document.createElement('input')).attr({id:'query_parameter',name:'query_parameter',type:'text', value:''});
  queryTemplate.append(queryParameter).append(' ');

  var removeOption = $(document.createElement('input')).attr({name:'remove_query_condition',type:'submit',value:$.t('actions.removeParameter'),style:'width: 28px;','onclick':'removeQuery(this); return false;'});
  queryTemplate.append(removeOption).append(' ');

  var addOption = $(document.createElement('input')).attr({name:'add_query_condition',style:'width: 28px',type:'submit',value:$.t('actions.addParameter')});
  queryTemplate.append(addOption).append(' ');
  queryTemplate.append($(document.createElement('div')).addClass('clear'));

  $(document.createElement('div')).addClass('js-query-insert').insertAfter(queryTemplate);

  var searchButton = $(document.createElement('input')).attr({name:'submit_query',type:'submit',value:$.t('actions.search')});
  searchButton.click(function() {
    searchFlexidata();
    return false;
  })
  fieldset.append(searchButton).append(' ');;

  var clearButton = $(document.createElement('input')).attr({name:'reset_query',type:'submit',value:$.t('actions.clearSearch'),style:'color:red;'});
  clearButton.click(function() {
    clearQuery('.flexisearch');
    return false;
  });
  fieldset.append(clearButton);

  container.append(fieldset);
  addSearchMenuEventHandlers(fieldset);
  
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

  if (!$.isEmptyObject(query)) {
    $.fr.currentView.search = {
      query: query,
      searchAll: $(":input[name=search_all]").attr('checked')
    }
  }
}

function clearQuery() {
  $(".query_template:not([class*=main])").remove();
  $(":input[name=query_parameter]", $(".query_template")).val('');
  $(":input[name=operator]", $(".query_template")).val('contains');
  updateViewQuery();
  invokeViewUpdated();
}

function searchFlexidata() {
  $.get($.fi.requestURL, buildFlexiOptions(), buildFlexiview, "json");
  invokeViewUpdated();
}

function updateQuery(event) {
  if (event.keyCode == 13) {
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
      clearQuery();
      var first = true;
              
      for (var key in $.fr.currentView.search.query) {
        
        var q = $.fr.currentView.search.query[key];
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
  }
  //"search":{"searchAll":"true","query":{"0":{"value":"300","operator":"lesser_or_equal","attribute":"company_attendances.id"},"1":{"value":"200","operator":"greater_or_equal","attribute":"company_attendances.id"}}}}
}

function addSearchMenuEventHandlers(container) {
  $('input[name=query_parameter]', container).keypress(function(e) {
    updateQuery(e);
  });
  
  $('input[name=remove_query_condition]',container).bind('click',function() {
    removeQuery(this);
    return false;
  });
  
  $('input[name=add_query_condition]',container).bind('click',function() {
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