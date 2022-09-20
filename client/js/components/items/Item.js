import { makeRequest } from '../../utils.js'

export default class Item extends HTMLElement {
  data = null
  loadingTimeout = null

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
    this.loading = true
    this.data = await makeRequest(source)
    this.loading = false
    this.processData && this.processData()
    this.render()
  }

  showLoading() {
    if(this.loadingTimeout) {
      this.hideLoading()
    }

    this.loadingTimeout = setTimeout(() => {
      this.appendChild(document.createElement('loading-element'))
    }, 300)
  }

  hideLoading() {
    clearTimeout(this.loadingTimeout)
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