function setupSelection() {
  $("tr.flexirow").unbind('click');
  if ($.fr.currentView.hasSelectableRows) {
    $("tr.flexirow").click(function(evnt) {
      rowSelected($(this), evnt);
    });
  }
}

function rowSelected(row, evnt) {
  row.toggleClass('selected');
  if (row.hasClass('selected')) {
    if ($.fr.rowSelected) {
      $.fr.rowSelected(row);
    }
  } else {
    if ($.fr.rowDeselected) {
      $.fr.rowDeselected(row);
    }
  }
}