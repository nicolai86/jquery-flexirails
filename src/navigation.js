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
        '<a style="cursor: pointer;">'+
          '<img src="/images/flexirails/first.png">'+
        '</a>'+
        '<a style="cursor: pointer;">'+
          '<img src="/images/flexirails/prev.png">'+
        '</a>'+
        '<span>'+
          '{{locales/page}}'+
          '<input class="js-fr-from-page" name="current_page_box" type="text">'+
          '{{locales/of}}'+
          '<span class="to">1</span>'+
        '</span>'+
        '<a style="cursor: pointer;">'+
          '<img src="/images/flexirails/next.png">'+
        '</a>'+
        '<a style="cursor: pointer;">'+
          '<img src="/images/flexirails/last.png">'+
        '</a>'+
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
  
  invokeNavigationCreated(container);
}

function invokeNavigationCreated(container) {
  if ($.fr.navigationCreated != null) {
    for (var i=0; i < $.fr.navigationCreated.length; i++) {
      $.fr.navigationCreated[i].apply(this, [container]);
    }
  }
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
