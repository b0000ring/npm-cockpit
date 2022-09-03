import { Popup } from './Popup.js'

const included = ['author', 'description', 'keywords', 'license', 'repository', 'version']

export class ModuleDataPopup extends Popup {
  createRow(key, content) {
    const row = document.createElement('tr')
    const th = document.createElement('th')
    const td = document.createElement('td')

    if(!included.includes(key) || !content) {
      return
    }
  
    th.setAttribute('scope', 'row')
    th.textContent = key
    row.appendChild(th)
    row.appendChild(td)

    if(key === 'keywords' && Array.isArray(content)) {
      td.textContent = content.join(', ')
    } else if(key === 'homepage') {
      const link = document.createElement('a')
      link.setAttribute('href', content)
      link.setAttribute('target', '_blank')
      link.textContent = content
      td.appendChild(link)
    } else if(Array.isArray(content)) {
      content.forEach(item => {
        const div = document.createElement('div')
        div.textContent = item
        div.appendChild(document.createElement('hr'))
        td.appendChild(div)
      })
    } else if(typeof content === 'object') {
      const values = Object.entries(content).map(item => {
        const [label, value] = item
        return `${label}: ${value}`
      })
      const nodes = values.map(item => {
        const node = document.createElement('div')
        node.textContent = item
        return node
      })
      td.append(...nodes)
    } else {
      td.textContent = content
    }

    return row
  }

  // TODO refactor
  connectedCallback() {
    const data = this.__data__
    const root = document.createElement('div')
    root.className = 'modal-content'

    const header = document.createElement('div')
    header.className = 'modal-header'
    header.textContent = data.name

    const npmLink = document.createElement('a')
    npmLink.setAttribute('href', `https://www.npmjs.com/package/${data.name}/`)
    npmLink.setAttribute('target', '_blank')
    npmLink.textContent = 'NPM'
    
    const body = document.createElement('div')
    body.className = 'modal-body'

    const table = document.createElement('table')
    table.className = 'table'

    const tbody = document.createElement('tbody')

    table.appendChild(tbody)
    body.appendChild(table)
    if(!data.error) {
      header.appendChild(npmLink)
    }
    root.appendChild(header)
    root.appendChild(body)
    this.appendChild(root)

    Object.keys(data).forEach((key) => {
      const content = data[key]
      const row = this.createRow(key, content)
      row && tbody.appendChild(row)
    })

    this.applyCoords(root)
  }
}