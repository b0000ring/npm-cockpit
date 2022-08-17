export class Dashboard extends HTMLElement {
  layout = null

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

    this.layout.forEach(item => {
      const dashboardItem = document.createElement('dashboard-item')
  
      if(cell > 4) {
        cell = 1
        row += 1
      }

      let finishCell = cell + item.w

      if(finishCell > 5) {
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
}