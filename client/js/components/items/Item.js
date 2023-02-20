import { makeRequest } from '../../utils.js'

export default class Item extends HTMLElement {
  data = null
  loadingTimeout = null
  filters = {}
  innerLoading = false
  innerError = false

  /**
   * @param {boolean} value
   */
  set loading(value) {
    this.innerLoading = value
    value ? this.showLoading() : this.hideLoading()
  }

  get loading() {
    return this.innerLoading
  }

  /**
   * @param {boolean} value
   */
  set error(value) {
    this.innerError = value
    this.textContent = ''
    const error = document.createElement('div')
    error.className = 'error'
    error.textContent = 'Data loading error'

    this.append(error)
  }

  get error() {
    return this.innerError
  }

  constructor(source) {
    super()

    source && this.loadData(source)
  }

  async loadData(source) {
    this.loading = true
    this.data = await makeRequest(source)

    if(this.data.error) {
      this.error = true
      this.loading = false
      return
    }
    this.loading = false
    this.processData && this.processData()
    this.render()
  }

  applyFilter(key, value) {
    this.filters[key] = value
  }

  renderFilters() {
    const element = this.querySelector('.filters')
    if(element) {
      return
    }

    const filters = document.createElement('div')
    filters.className = 'filters'

    this.addFilters?.(filters)

    this.append(filters)
  }

  resize() {
    // should be implemented in successor
  }

  showLoading() {
    if(this.loadingTimeout) {
      this.hideLoading()
    }

    this.loadingTimeout = setTimeout(() => {
      this.style.pointerEvents = 'none'
      this.style.opacity = '0.6'
  
      const loadingIcon = document.createElement('icon-element')
      loadingIcon.className = 'loading'
      loadingIcon.id = 'loading'
      loadingIcon.data = '/static/loading.svg'
      loadingIcon.width = '100'
      loadingIcon.height = '100'

      this.appendChild(loadingIcon)
    }, 300)
  }

  hideLoading() {
    clearTimeout(this.loadingTimeout)
    this.style.pointerEvents = 'auto'
    this.style.opacity = '1'
    this.querySelector('#loading')?.remove()
  }

  render() {
    throw new Error('render function should be implemented for specific item component')
  }

  connectedCallback() {
    this.className = 'item'
    this.render()
    this.renderFilters()

    window.addEventListener('dashboard-resize', () => {
      this.resize()
    })
  }
}