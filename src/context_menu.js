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
    toggle.change(function() {
      toggleFlexiColumn($(this).attr('rel'));
    });

    li.append(toggle);
    li.append(col.title);
    ul.append(li);
  };

  container.append(ul);
}