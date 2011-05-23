function createNavigation(container) {
  if (!$.fr.hasOwnProperty('navigationTemplate')) {
    $.fr.navigationTemplateSource = '<div>'+
      '<div class="label">{{locales/resultsPerPage}}</div>'+
      '<div class="select">'+
        '<select id="per_page" name="per_page">'+
          '{{#resultsPerPage}}'+
            '<option value="{{value}}">{{label}}</option>'+
          '{{/resultsPerPage}}'+
        '</select>'+
      '</div>'+
      '<div class="pagination">'+
        '<a name="toFirstPage"><span style="cursor: pointer;" class="first"></span></a>'+
        '<a name="toPrevPage"><span style="cursor: pointer;" class="prev"></span></a>'+
        '<span>'+
          '{{locales/page}}'+
          '<input class="js-fr-from-page" name="current_page_box" type="text">'+
          '{{locales/of}}'+
          '<span class="to">1</span>'+
        '</span>'+
        '<a name="toNextPage"><span style="cursor: pointer;" class="next"></span></a>'+
        '<a name="toLastPage"><span style="cursor: pointer;" class="last"></span></a>'+
      '</div>'+
      '<div class="results label">'+
        '<span class="total_results">1</span>'+
        'Results'+
      '</div>'+
    '</div>';
    $.fr.navigationTemplate = Handlebars.compile($.fr.navigationTemplateSource);
  }
  
  var resultsPerPage = new Array();
  for (var i = 0; i < $.fr.defaults.perPageOptions.length; i++) {
    resultsPerPage.push({ 
      value : $.fr.defaults.perPageOptions[i],
      label : ($.fr.defaults.perPageOptions[i] == -1 ? $.t('results.loadAll') : $.fr.defaults.perPageOptions[i])
    });
  };
  
  container.addClass('flexinavigation');
  var data = {
    "locales"             : {
      "resultsPerPage"    : $.t('results.perPage'),
      "page"              : $.t('results.page'),
      "of"                : $.t('results.of')
    },
    "resultsPerPage"      : resultsPerPage
  };
  var navigation = $.fr.navigationTemplate(data);
  
  container.append(navigation);
  $(container).delegate("a[name=toFirstPage]","click",paginateToFirstPage);
  $(container).delegate("a[name=toPrevPage]","click",paginateToPrevPage);
  $(container).delegate("a[name=toNextPage]","click",paginateToNextPage);
  $(container).delegate("a[name=toLastPage]","click",paginateToLastPage);
  $(container).delegate(":input[name=current_page_box]", "change", paginateToAnyPage);
  $(container).delegate(":input[name=per_page]", "change", changePerPage);
  
  invokeNavigationCreated(container);
}

function invokeNavigationCreated(container) {
  if ($.fr.navigationCreated != null) {
    for (var i=0; i < $.fr.navigationCreated.length; i++) {
      $.fr.navigationCreated[i].apply(this, [container]);
    }
  }
}

function changePerPage() {
  updatePerPage($(this).val());
}
function paginateToAnyPage() {
  paginate($(this).val());
}
function paginateToFirstPage(){
  paginate($.fr.pagination.first);
  return false;
}
function paginateToPrevPage() {
  paginate(Math.max(parseInt($.fr.currentView.currentPage) - 1, $.fr.pagination.first));
  return false;
}
function paginateToNextPage() {
  paginate(Math.min(parseInt($.fr.currentView.currentPage) + 1, $.fr.pagination.last));
  return false;
}
function paginateToLastPage(){
  paginate($.fr.pagination.last);
  return false;
}

function paginate(to_page) {
  if (to_page > $.fr.pagination.last || to_page < 1) {
    $(".js-fr-from-page").val($.fr.currentView.currentPage);
  }
  if ($.fr.currentView.currentPage != to_page) {
    $.fr.currentView.currentPage = parseInt(to_page);
    
    invokeViewUpdated();
    reloadFlexidata();
  }
}

function changePerPageOption() {
  updatePerPage($(this).val());
}

function updatePerPage(new_per_page) {
  if (new_per_page == -1) {
    if (!confirm($.t('confirm.loadAll'))) {
      $(":input[name=per_page]").val($.fr.currentView.perPage);
      return;
    }
  }

  if (new_per_page != $.fr.currentView.perPage) {
    $.fr.currentView.currentPage = 1;
    $.fr.currentView.perPage = new_per_page;

    invokeViewUpdated();
    reloadFlexidata();
  }
}
