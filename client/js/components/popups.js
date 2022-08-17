export class Popups extends HTMLElement {
  static popups = []
  static subscribers = []

  static update() {
    this.subscribers.forEach(item => item.renderPopups())
  }

  static addPopup(data) {
    const index = this.popups.findIndex(item => item.popup === data.popup)
    if(index !== -1) {
      this.removePopup(data.popup)
    }
    setTimeout(() => {
      this.popups.push(data)
      this.update()
    }, 100)
  }

  static removePopup(type) {
    setTimeout(() => {
      const index = this.popups.findIndex(item => item.popup === type)
      const element = document.getElementsByTagName(type)[0]
      const hover = element?.matches(`${type}:hover`)
      if(element && index !== -1 && !hover) {
        this.popups.splice(index, 1)
        this.update()
      }
  
      if(hover) {
        element.addEventListener('mouseleave', () => {
          this.removePopup(type)
        })
      }
    }, 100)
    
  }

  constructor() {
    super()
    
    Popups.subscribers.push(this)
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
    Popups.popups.forEach((item) => {
      this.renderPopup(item)
    })
  }

  connectedCallback() {
    this.renderPopups()
  }
}