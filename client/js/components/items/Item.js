export default class Item extends HTMLElement {
  loading = true
  data = null

  constructor(source) {
    super()

    source && this.loadData(source)
  }

  async loadData(source) {
    this.data = await d3.json(source)
    this.loading = false
    this.render()
  }

  showLoading() {
    this.appendChild(document.createElement('loading-element'))
  }

  // should be implemented in successor
  redraw() {
    throw new Error('render function should be implemented for specific item component')
  }

  render() {
    this.innerHTML = ''
    if(this.loading) {
      this.showLoading()
      return
    }

    this.redraw()
  }

  connectedCallback() {
    this.className = 'item'
    this.render()
  }
}