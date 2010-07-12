function createNavigation(container) {
  container.addClass('flexinavigation');
  
  var perPageLabel = $(document.createElement('div')).addClass('label');
  perPageLabel.append($.t('results.perPage'));
  container.append(perPageLabel);
  
  var perPageOptions = $(document.createElement('div')).addClass('select');
  
  var perPageSelect = $(document.createElement('select')).attr({id:'per_page',name:'per_page'});
  for (var i = 0; i < $.fr.defaults.perPageOptions.length; i++) {
    var option = $(document.createElement('option')).attr({value:$.fr.defaults.perPageOptions[i]}).append($.fr.defaults.perPageOptions[i] == -1 ? $.t('results.loadAll') : $.fr.defaults.perPageOptions[i]);
    perPageSelect.append(option);
  }
  perPageSelect.change(function changePerPageOption() {
    updatePerPage(perPageSelect.val());
  });
  perPageOptions.append(perPageSelect);
  container.append(perPageOptions);
  
  var pagination = $(document.createElement('div')).addClass('pagination');
  var toFirstPage = $(document.createElement('a')).attr('style', 'cursor: pointer;').append(
    $(document.createElement('img')).attr({src:'/images/first.png'})
  );
  toFirstPage.click(function paginateToFirstPage(){
    paginate($.fr.pagination.first);
    return false;
  });
  pagination.append(toFirstPage);
  
  var toPrevPage = $(document.createElement('a')).attr('style', 'cursor: pointer;').append(
    $(document.createElement('img')).attr({src:'/images/prev.png'})
  );
  toPrevPage.click(function paginateToPrevPage() {
    paginate(Math.max(parseInt($.fr.currentView.currentPage) - 1, $.fr.pagination.first));
    return false;
  });
  pagination.append(toPrevPage);
  
  var pageInfo = $(document.createElement('span'));
  pageInfo.append($.t('results.page'));
  var pageInfoBox = $(document.createElement('input')).attr({'class':'js-fr-from-page', name:'current_page_box', type:'text'})
  pageInfoBox.change(function paginateToAnyPage() {
    paginate($(this).val());
  })
  pageInfo.append(pageInfoBox);
  pageInfo.append($.t('results.of'));
  pageInfo.append($('<span class="to">'+$.fr.pagination.last+'</span>'));
  pagination.append(pageInfo);
  
  var toNextPage = $(document.createElement('a')).attr('style', 'cursor: pointer;').append(
    $(document.createElement('img')).attr({src:'/images/next.png'})
  );
  toNextPage.click(function paginateToNextPage() {
    paginate(Math.min(parseInt($.fr.currentView.currentPage) + 1, $.fr.pagination.last));
    return false;
  });
  pagination.append(toNextPage);
  
  var toLastPage = $(document.createElement('a')).attr('style', 'cursor: pointer;').append(
    $(document.createElement('img')).attr({src:'/images/last.png'})
  );
  toLastPage.click(function paginateToLastPage(){
    paginate($.fr.pagination.last);
    return false;
  });
  pagination.append(toLastPage);
  
  var results = $(document.createElement('div')).addClass('results').addClass('label');
  results.append($(document.createElement('span')).addClass('total_results')).append(' ').append($.t('results.total'));
  container.append(pagination);
  container.append(results);
  
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
  if (new_per_page == -1 && !confirm(flexirails_load_all_confirmation)) {
    $(":input[name=per_page]").val($.fr.currentView.perPage);
    return;
  }

  if (new_per_page != $.fr.currentView.perPage) {
    $.fr.currentView.currentPage = 1;
    $.fr.currentView.perPage = new_per_page;

    invokeViewUpdated();
    reloadFlexidata();
  }
}