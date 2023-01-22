const ROW_CELLS = 10
const ROWS = 6
const CELL_SIZE = 100

export class Dashboard extends HTMLElement {
  layout = null

  constructor() {
    super()

    window.addEventListener('dashboard-scroll', (e) => {
      this.scrollToSection(e.detail)
    })

    fetch('/api/layout')
      .then(result => result.json())
      .then(data => {
        this.layout = data.layout
        this.render()
      })
  }

  scrollToSection(section) {
    const element = this.querySelector(`#${section}`)
    element.scrollIntoView({behavior: 'smooth'})
  }

  renderWidget(data) {
    const widget = document.createElement('dashboard-widget')
   
    widget.style['grid-column'] = `span ${data.w}`
    widget.style['grid-row'] = `span ${data.h}`
    widget.setAttribute('name', data.title)
    widget.setAttribute('component', data.component)
    return widget
  }

  renderSection(data) {
    const wrapper = document.createElement('div')
    wrapper.className = 'dashboard-section'
    wrapper.id = data.id
  
    const title = document.createElement('h2')
    title.className= 'dashboard-section-title'
    title.textContent = data.title

    const grid = document.createElement('div')
    const gridColumns = new Array(ROW_CELLS).fill(`${CELL_SIZE}px`).join(' ')
    const gridRows = new Array(ROWS).fill(`${CELL_SIZE}px`).join(' ')
    grid.className = 'dashboard-section-content'
    grid.style.gridTemplateColumns = gridColumns
    grid.style.gridTemplateRows = gridRows
  
    const widgets = data.widgets.map(widgetData => {
      return this.renderWidget(widgetData)
    })

    grid.append(...widgets)
    wrapper.append(title, grid)
    this.append(wrapper)
  }

  render() {
    this.layout.forEach(section => {
      this.renderSection(section)
    })
  }

  connectedCallback() {
    this.layout && this.render()
  }
}