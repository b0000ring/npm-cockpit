export class CustomTable extends HTMLElement {
  connectedCallback() {
    const data = this.__items__
    const columns = this.__columns__

    const table = document.createElement('table')
    table.className = 'table'
    const tbody = document.createElement('tbody')
    const header = document.createElement('thead')
    const headerRow = document.createElement('tr')
    header.append(headerRow)

    Object.values(columns).forEach(name => {
      const th = document.createElement('th')
      th.textContent = name
      headerRow.append(th)
    })

    data.forEach(item => {
      const row = document.createElement('tr')
      Object.keys(columns).forEach(key => {
        const td = document.createElement('td')
        td.textContent = item[key]
        row.append(td)
      })
      tbody.append(row)
    })
    
    table.append(header)
    table.append(tbody)
    this.append(table)
  }
}