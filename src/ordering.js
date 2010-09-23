function setupOrderByColumns() {
  $($.fr.currentView.cols).each(function() {
    var col = this;

    if (!col.searchable) {
      return;
    }

    $("th."+col.cacheName).click(function sortByColumn() {
      var now = new Date().getTime();
      if (now - $.fi.lastClick < 200) {
        return;
      }

      $.fi.lastClick = now;

      if ($.fr.currentView.order.by != null) {
        $("th."+$.fr.currentView.order.reflectionPath).removeClass('sorted');
      }

      $.fr.currentView.order.by               = col.association; 
      $.fr.currentView.order.reflectionPath   = col.cacheName;

      if ($.fr.currentView.order.direction == 'asc') {
        $.fr.currentView.order.direction = 'desc';
      } else {
        $.fr.currentView.order.direction = 'asc';
      }
      
      addOrderByClassesToDOM();
      
      reloadFlexidata();
      invokeViewUpdated();
    });
  });
  
  if ($.fr.currentView.order.by != null) {
    addOrderByClassesToDOM();
  }
}

function addOrderByClassesToDOM() {
  var selector= "th."+$.fr.currentView.order.reflectionPath;

  $(selector).addClass('sorted');
  if ($.fr.currentView.order.direction == 'asc') {
    $(selector).removeClass('asc');
    $(selector).addClass('desc');
  } else {
    $(selector).removeClass('desc');
    $(selector).addClass('asd');
  }
}

function orderByOptions() {
  var order = new Object();
  order["by"] = ($.fr.currentView.order.by != null ? $.fr.currentView.order.by : '');
  order["direction"] = ($.fr.currentView.order.by != null ? $.fr.currentView.order.direction : '');
  return order;
}
