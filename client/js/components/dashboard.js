export class Dashboard extends HTMLElement {
  layout = null
  rowCells = 4
  resize_ob = null
  timeout = null
  items = []

  constructor() {
    super()

    fetch('/api/layout')
      .then(result => result.json())
      .then(data => {
        this.layout = data.layout
        this.render()
      })

    this.resize_ob = new ResizeObserver(() => {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(this.changeSize.bind(this), 100)
    })
  }

  // refactor this
  render() {
    let cell = 1
    let row = 1
    // TODO refactor
    this.layout.forEach((item, i) => {
      const dashboardItem = this.items[i] || document.createElement('dashboard-item')
  
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
    
      if(!this.items[i]) {
        this.appendChild(dashboardItem)
        this.items[i] = dashboardItem
      }
      
    })

    window.dispatchEvent(
      new CustomEvent('dashboard-resize')
    )
  }

  applyGrid() {
    const maxCellWidth = 480
    const width = this.offsetWidth
    let rowCells = Math.ceil(width / maxCellWidth)

    if(rowCells < 4) {
      rowCells = 4
    }

    const columnWidth = 100 / (rowCells)
    const value = new Array(rowCells).fill(`${columnWidth - 1}%`).join(' ')

    this.rowCells = rowCells
    this.style.gridTemplateColumns = value
  }

  changeSize() {
    this.applyGrid()
    this.render()
  }

  connectedCallback() {
    this.applyGrid()
    this.resize_ob.observe(this)
  }
}