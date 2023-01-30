export class CustomTable extends HTMLElement {

  constructor() {
    super()

    this.addEventListener('click', (e) => {
      if(e.target['data-name']) {
        e.stopPropagation()
        window.dispatchEvent(
          new CustomEvent(`dashboard-scroll`, {detail: 'dependencies-list'})
        )

        window.dispatchEvent(
          new CustomEvent(`dependency-filter-applied-dependencies-list`, {detail: e.target['data-name']})
        )
      }
    })
  }

  applyStyle(column, data, cell) {
    const settings = this.__settings__

    if(settings?.[column]?.color) {
      cell.className += ' chip'
      cell.style.backgroundColor = settings[column].color[data]
      cell.style.color = 'white'
    }
  }

  getCellContent(column, data) {
    const content = document.createElement('div')
    content.textContent = data

    // making all dep names a link to deps list widget
    if(column === 'name') {
      content.className = 'link'
      content['data-name'] = data
      content.title = 'Show in dependencies list'
    }

    this.applyStyle(column, data, content)
    return content
  }

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
        td.append(this.getCellContent(key, item[key]))
        row.append(td)
      })
      tbody.append(row)
    })
    
    table.append(header)
    table.append(tbody)
    this.append(table)
  }
}