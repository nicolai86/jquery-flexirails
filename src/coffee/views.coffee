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
  <select>
    <option value="5">5</option>
  </select>
</div>
<div>
  <a href="#">First Page</a>
  <a href="#">Prev Page</a>
  <div>
    Page 1 of 1
  </div>
  <a href="#">Next Page</a>
  <a href="#">Last Page</a>
</div>
<div>
  0 Results
</div>
</div>'''