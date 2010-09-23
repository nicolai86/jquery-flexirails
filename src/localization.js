var fl = $.fl = {
  actions : {
    search            : 'Suchen',
    clearSearch       : 'Suche löschen',
    addParameter      : '+',
    removeParameter   : '-'
  },
  search : {
    title             : 'Suche',
    meetAllCriteria   : 'Muss alle Kriterien erfüllen'
  },
  confirm : {
    loadAll           : 'Wirklich alle Ergebnisse laden?'
  },
  results : {
    perPage           : 'Ergebnisse pro Seite:',
    page              : 'Seite ',
    of                : ' von ',
    total             : ' Ergebnisse',
    loadAll           : 'Alle'
  }
}

$.t = function(path) {
  return $.extractAttribute($.fl, 't.'+path);
}

var setLocales = fr.setLocales = function(d) {
	$.extend(true, fl, d);
};
