export default class Item extends HTMLElement {
  data = null

  set loading(value) {
    value ? this.showLoading() : this.hideLoading()
  }

  constructor(source) {
    super()

    source && this.loadData(source)
  }

  async loadData(source) {
    this.data = await d3.json(source)
    this.loading = false
    this.processData && this.processData()
    this.render()
  }

  showLoading() {
    this.appendChild(document.createElement('loading-element'))
  }

  hideLoading() {
    this.querySelector('loading-element')?.remove()
  }

  render() {
    throw new Error('render function should be implemented for specific item component')
  }

  connectedCallback() {
    this.className = 'item'
    this.render()
  }
}