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

# a Flexirails row
flexiRow = '''<tr class="fr-row">
  {{#cells}}
    <td class="fr-cell {{selector}}">
      {{value}}
    </td>
  {{/cells}}
</tr>'''

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
  <a href="#" class="fr-first-page">First Page</a>
  <a href="#" class="fr-prev-page">Prev Page</a>
  <div>
    Page <span class="fr-current-page">{{options.currentPage}}</span> of <span class="fr-total-pages">{{totalPages}}</span>
  </div>
  <a href="#" class="fr-next-page">Next Page</a>
  <a href="#" class="fr-last-page">Last Page</a>
</div>
<div>
  <span class="fr-total-results">{{options.entries}}</span> Results
</div>
</div>'''