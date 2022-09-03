export default class Item extends HTMLElement {
  data = null
  loading = null

  /**
   * @param {boolean} value
   */
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
    if(this.loading) {
      this.hideLoading()
    }

    this.loading = setTimeout(() => {
      this.appendChild(document.createElement('loading-element'))
    }, 1000)
  }

  hideLoading() {
    clearTimeout(this.loading)
    this.querySelector('loading-element')?.remove()
    this.loading = null
  }

  render() {
    throw new Error('render function should be implemented for specific item component')
  }

  connectedCallback() {
    this.className = 'item'
    this.render()
  }
}