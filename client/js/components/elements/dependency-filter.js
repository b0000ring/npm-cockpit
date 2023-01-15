import { makeRequest } from '../../utils.js'

export class DependencyFilter extends HTMLElement {
  isOpen = null
  deps = null
  filter = ''

  constructor() {
    super()

    this.getDependenciesList()

    // close list on outside click handler
    document.addEventListener('click', (e) => {
      if(!this.contains(e.target)){
        this.isOpen = false
        this.renderList()
      }
    })
  }

  async getDependenciesList() {
    const data = await makeRequest('/api/dependencies')
    this.deps = Object.keys(data.dependencies).sort()
    this.renderInput()
  }

  renderInput() {
    let input = this.querySelector('input')
    if(!input) {
      input = document.createElement('input')
      input.type = 'text'
      input.placeholder = 'Select dependency'
      input.addEventListener('click', () => {
        this.isOpen = true
        this.renderList()
      })
      input.addEventListener('input', (e) => {
        this.filter = e.target.value
        this.renderList()
      })
      this.append(input)
    }

    input.disabled = !this.deps
    input.value = this.filter
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
          this.filter = target.textContent
          this.renderInput()
          this.renderList()
          this.onApply()
        }
      })
      this.append(list) 
    }

    // clear the element content before rendering options
    list.textContent = ''
    const content = this.deps
      .filter(item => item.startsWith(this.filter))
      .slice(0, 10)
      .map(item => {
        const option = document.createElement('li')
        option.textContent = item

        return option
      })

    list.append(...content)
  }

  onApply() {
    window.dispatchEvent(
      new CustomEvent(`dependency-filter-applied-${this.id}`, {detail: this.filter})
    )
  }

  renderClear() {
    const button = document.createElement('div')
    button.textContent = '×'
    button.className = 'dependency-filter_clear'
    button.addEventListener('click', () => {
      this.filter = ''
      this.onApply()
      this.renderInput()
      this.renderList()
    })
    this.append(button)
  }

  connectedCallback() {
    this.renderInput()
    this.renderClear()
  }
}