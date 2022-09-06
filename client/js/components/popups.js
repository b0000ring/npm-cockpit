// TODO change static props and methods to native browser events
export class Popups extends HTMLElement {
  popups = []
  timeouts = {}

  constructor() {
    super()
    window.addEventListener('popups-add', (e) => {
      this.addPopup(e.detail)
    })
    window.addEventListener('popups-remove', (e) => {
      this.removePopup(e.detail)
    })
  }

  addPopup(data) {
    clearTimeout(this.timeouts[data.popup])
    const index = this.popups.findIndex(item => item.popup === data.popup)
    if(index !== -1) {
      this.removePopup(data.popup, 0)
    }
    this.timeouts[data.popup] = setTimeout(() => {
      this.popups.push(data)
      this.renderPopups()
    }, 200)
  }

  removePopup(type, timeout = 200) {
    clearTimeout(this.timeouts[type])
    this.timeouts[type] = setTimeout(() => {
      const index = this.popups.findIndex(item => item.popup === type)
      const element = document.getElementsByTagName(type)[0]
      const hover = element?.matches(`${type}:hover`)
      if(element && index !== -1 && !hover) {
        this.popups.splice(index, 1)
        this.renderPopups()
      }
  
      if(hover) {
        element.addEventListener('mouseleave', () => {
          this.removePopup(type)
        })
      }
    }, timeout)
  }

  renderPopup(data) {
    const popup = document.createElement(data.popup)
    Object.entries(data.options).forEach(item => {
      const [option, value] = item
      popup[option] = value
    })
    this.appendChild(popup)
  }

  renderPopups() {
    this.innerHTML = ''
    this.id = 'popups'
    this.popups.forEach((item) => {
      this.renderPopup(item)
    })
  }

  connectedCallback() {
    this.renderPopups()
  }
}