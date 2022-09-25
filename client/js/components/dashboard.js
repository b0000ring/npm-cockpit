export class Dashboard extends HTMLElement {
  layout = null
  rowCells = 4

  constructor() {
    super()

    fetch('/api/layout')
      .then(result => result.json())
      .then(data => {
        this.layout = data.layout
        this.render()
      })
  }

  // refactor this
  render() {
    let cell = 1
    let row = 1
    // TODO refactor
    this.layout.forEach(item => {
      const dashboardItem = document.createElement('dashboard-item')
  
      if(cell > this.rowCells) {
        cell = 1
        row += 1
      }

      let finishCell = cell + item.w

      if(finishCell > this.rowCells + 1) {
        cell = 1
        finishCell = item.w + 1
        row += 1
      }
  
      dashboardItem.style['grid-column'] = `${cell} / ${finishCell}`
      dashboardItem.style['grid-row'] = `${row} / ${row + 1}`
      dashboardItem.setAttribute('name', item.title)
      dashboardItem.setAttribute('component', item.component)
  
      cell = finishCell
    
      this.appendChild(dashboardItem)
    })
  }

  connectedCallback() {
    const maxCellWidth = 480
    const width = this.offsetWidth
    let rowCells = Math.ceil(width / maxCellWidth)

    if(rowCells < 4) {
      rowCells = 4
    }

    const columnWidth = 100 / (rowCells)
    const value = new Array(rowCells).fill(`${columnWidth - 1}%`).join(' ')
    console.log(rowCells, value)
    this.rowCells = rowCells
    this.style.gridTemplateColumns = value
  }
}