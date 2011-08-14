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
  Results per Page
  <select class="fr-per-page">
    <option value="2">2</option>
    <option value="5">5</option>
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
  0 Results
</div>
</div>'''