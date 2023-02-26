export class CustomSelect extends HTMLElement {
  value = ''
  isOpen = false

  constructor() {
    super()

    // close list on outside click handler
    document.addEventListener('click', (e) => {
      if(!this.contains(e.target)){
        this.isOpen = false
        this.renderList()
      }
    })
  }

  renderTrigger() {
    let trigger = this.querySelector('.custom-select_trigger')
    if(!trigger) {
      trigger = document.createElement('div')
      trigger.className = 'custom-select_trigger'
      trigger.addEventListener('click', () => {
        this.isOpen = true
        this.renderList()
      })

      this.append(trigger)
    }

    trigger.textContent = ''

    const value = document.createElement('span')
    value.textContent = this.value || this.__placeholder__

    if(!this.value) {
      value.className += ' unselected'
    }

    const arrow = document.createElement('span')
    arrow.textContent = '▼'

    trigger.append(value, arrow)
  }

  renderList() {
    let list = this.querySelector('ul')
    if(!this.isOpen) {
      list?.remove()
      return
    }
    
    if(!list) {
      list = document.createElement('ul')

      // listner for option click
      list.addEventListener('click', (e) => {
        const { target } = e
        if(target.tagName === 'LI') {
          this.isOpen = false
          this.value = target.textContent
          this.renderTrigger()
          this.renderList()
          this.onApply()
        }
      })

      this.append(list)
    }

    list.textContent = ''

    const empty = document.createElement('li')
    empty.textContent = ''
    empty.style.fontStyle = 'italic'

    const options = this.__options__
    const content = options.map(item => {
      const option = document.createElement('li')
      option.textContent = item

      return option
    })

    list.append(empty, ...content)
  }

  onApply() {
    window.dispatchEvent(
      new CustomEvent(`custom-select-applied-${this.id}`, {detail: this.value})
    )
  }

  connectedCallback() {
    this.renderTrigger()
  }
}