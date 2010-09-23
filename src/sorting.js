function updateFlexiheadersSortable(event, ui) {
  var val = $(ui.item).attr('class').split(' ')[0];
  $("td."+val).show();

  for (var i = 0; i < $.fr.currentView.cols.length; i++) {
    var col = $.fr.currentView.cols[i];
    if (val.indexOf(col.cacheName) == 0) {    
      var oldPos = i;

      var childs = $(".header").children();
      for (var pos = 0; pos < childs.length; pos++) {
        if ($(childs[pos]).hasClass(col.cacheName)) {
          var newPos = 0;

          for (j = 0; j < $.fr.currentView.cols.length; j++) {
            if ($.fr.currentView.cols[j].real_position == pos) {
              newPos = j;
              break;
            } 
          }
          
          switchFlexiheaders(oldPos, newPos, col);
          break;
        }
      }
      break;
    }
  }

  updateRealColumnPositions();
  setupFirstLastColumns();
}

function flexiheadersSortable() {  
  if (!$.fr.currentView.sortable) {
    $($.fi.flexiHeader).sortable('destroy');
  } else {
    $($.fi.flexiHeader).sortable('destroy');
    // Header sortable
    $($.fi.flexiHeader).sortable(
      {
        helper    : 'clone',
        items     : 'th[class*=sortable]',
        start: function headerDragStarted(event, ui) {
          var val = $(ui.item).attr('class').split(' ')[0];
          $("td."+val).hide();
          $(ui.helper).addClass('dragged');
        },
        beforeStop: function headerDreagStopped(event, ui) {
          $(ui.helper).removeClass('dragged');
          var val = $(ui.item).attr('class').split(' ')[0];
          $("td."+val).show();
        },
        update: updateFlexiheadersSortable
      }
    ).data("sortable").floating = true; 
  }
}

function setupFirstLastColumns() {
  $("td.first,th.first").removeClass("first");
  $("td.last,th.last").removeClass("last");

  for (var first = 0; first < $.fr.currentView.cols.length; first++) {
    if ($.fr.currentView.cols[first].visible) {
      $("td."+$.fr.currentView.cols[first].cacheName).addClass("first");
      $("th."+$.fr.currentView.cols[first].cacheName).addClass("first");
      break;
    }
  }

  for (var last = $.fr.currentView.cols.length - 1; last >= 0; last--) {
    if ($.fr.currentView.cols[last].visible) {
      $("td."+$.fr.currentView.cols[last].cacheName).addClass("last");
      $("th."+$.fr.currentView.cols[last].cacheName).addClass("last");
      break;
    }
  }
}
