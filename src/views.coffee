# the basic Flexirails table layout
flexiTable = '''<table class="fr-table">
<tbody>
  <tr class="fr-header">
    {{#view/columns}}
      <td class="{{selector}}">{{title}}</td>
    {{/view/columns}}
  </tr>
</tbody>
</table>'''

# Flexirails pagination
navigation = '''<div class="fr-navigation">
<div>
  <span rel="localize[pagination.resultsPerPage]">Results per Page</span>
  <select class="fr-per-page">
    {{#options/perPageOptions}}
      <option value="{{this}}">{{this}}</option>
    {{/options/perPageOptions}}
  </select>
</div>
<div>
  <a href="#" class="fr-first-page">
    <span rel="localize[pagination.toFirstPage]">First Page</span>
  </a>
  <a href="#" class="fr-prev-page">
    <span rel="localize[pagination.toPreviousPage]">Prev Page</span>
  </a>
  <div>
    <span rel="localize[pagination.page]">Page</span> 
    <span class="fr-current-page">{{options.currentPage}}</span> 
    <span rel="localize[pagination.of]">of</span> 
    <span class="fr-total-pages">{{totalPages}}</span>
  </div>
  <a href="#" class="fr-next-page">
    <span rel="localize[pagination.toNextPage]">Next Page</span>
  </a>
  <a href="#" class="fr-last-page">
    <span rel="localize[pagination.toLastPage]">Last Page</span>
  </a>
</div>
<div>
  <span class="fr-total-results">{{options.entries}}</span> 
  <span rel="localize[pagination.results]">Results</span>
</div>
</div>'''