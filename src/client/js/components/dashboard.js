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

    fetch('/layout.json')
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

    const header = document.createElement('div')
    header.className = 'dashboard-section_header'
  
    const title = document.createElement('h2')
    title.className = 'dashboard-section_header_title'
    title.textContent = data.title

    const infoWrapper = document.createElement('div')
    infoWrapper.addEventListener('mouseenter', function(e) {
      const {x, y, width, height} = e.target.getBoundingClientRect()
      const shift = 10
      window.dispatchEvent(
        new CustomEvent('popups-add', {
          detail: {
            popup: 'section-info-popup',
            options: {
              __data__: {
                section: data.id
              },
              x: (x + width / 2) + shift,
              y: (y + height / 2) + shift
            }
          }
        })
      )
    })
    infoWrapper.addEventListener('mouseleave', function(e) {
      window.dispatchEvent(
        new CustomEvent('popups-remove', {
          detail: 'section-info-popup'
        })
      )
    })

    const info = document.createElement('icon-element')
    info.data = '/static/info-icon.svg'
    info.width = '24'
    info.height = '24'
    info.className = 'dashboard-section_header_info'

    infoWrapper.append(info)
    
    const grid = document.createElement('div')
    const gridColumns = new Array(ROW_CELLS).fill(`${CELL_SIZE}px`).join(' ')
    const gridRows = new Array(ROWS).fill(`${CELL_SIZE}px`).join(' ')
    grid.className = 'dashboard-section-content'
    grid.style.gridTemplateColumns = gridColumns
    grid.style.gridTemplateRows = gridRows
  
    const widgets = data.widgets.map(widgetData => {
      return this.renderWidget(widgetData)
    })

    header.append(title, infoWrapper)
    grid.append(...widgets)
    wrapper.append(header, grid)
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