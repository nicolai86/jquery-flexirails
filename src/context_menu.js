function activateContextMenu() {
  if ($.fr.currentView.hasContextMenu) {
    $.fi.flexiHeader.destroyContextMenu();
    $.fi.flexiHeader.contextMenu({ menu: 'flexiContextMenu' });
  } else {
    $.fi.flexiHeader.destroyContextMenu();
    $.fi.flexiHeader.addClass('hidden');
  }
}

function createContextMenu(container) {
  container.children().remove();
  var ul = $(document.createElement('ul')).attr({id:'flexiContextMenu',style:'display: none'});

  for (var i=0; i < $.fr.currentView.cols.length; i++) {
    var col = $.fr.currentView.cols[i];

    var li = $(document.createElement('li')).addClass(col.cacheName);
    var toggle = $(document.createElement('input')).attr({
      id        :     'visible',
      name      :     'visible',
      type      :     'checkbox',
      value     :     'visible',
      checked   :     col.visible,
      rel       :     col.reflectionPath
    });
    toggle.change(function toggleColumnVisibility() {
      toggleFlexiColumn($(this).attr('rel'));
    });

    li.append(toggle);
    li.append(col.title);
    ul.append(li);
  };

  container.append(ul);
}

function toggleFlexiColumn(reflectionPath) {
  $(".header").sortable('destroy');
  for (var i = 0; i < $.fr.currentView.cols.length; i++) {
    var col = $.fr.currentView.cols[i];
    var name = col.cacheName;

    if (col.reflectionPath == reflectionPath) {
      if (col.visible) {
        if ($.fr.currentView.visibleColumnCount <= 1) {
          return;
        }
        $.fi.hiddenColumns[name] = new Array();
        $.fi.hiddenColumns[name][0] = $("th."+name).clone();
        $.fi.hiddenColumns[name][1] = $("td."+name).clone();

        $("td."+name+",th."+name).remove();
      } else {
        if (i == $.fr.currentView.cols.length - 1) {
          var next_visible = i-1;
          while ($.fr.currentView.cols[next_visible].visible == false) {
            next_visible -= 1;
          }
          
          var ncol = $.fr.currentView.cols[next_visible];
          $("th."+ncol.cacheName).after($($.fi.hiddenColumns[name][0]));
          var k = 0;
          $("td."+ncol.cacheName).each(function() {
            $(this).after($($.fi.hiddenColumns[name][1][k]));
            k++;
          });
        } else {

          var next_visible = findNextVisibleColumn(i);
          if (next_visible < i) {
            var ncol = $.fr.currentView.cols[next_visible];
            $("th."+ncol.cacheName).after($($.fi.hiddenColumns[name][0]));
            var k = 0;
            $("td."+ncol.cacheName).each(function(){
              $(this).after($($.fi.hiddenColumns[name][1][k]));
              k++;
            });
          } else {

            var ncol = $.fr.currentView.cols[next_visible];
            $("th."+ncol.cacheName).before($($.fi.hiddenColumns[name][0]));
            var k = 0;
            $("td."+ncol.cacheName).each(function(){
              $(this).before($($.fi.hiddenColumns[name][1][k]));
              k++;
            });
          }

        }

        delete $.fi.hiddenColumns[name];
      }
      col.visible = !col.visible;
      $.fr.currentView.visibleColumnCount += col.visible ? 1 : -1;
      break;
    }
  }
  flexiheadersSortable();
  setupFirstLastColumns();
}