import dependenciesPlot from '/js/plots/dependencies-tree.js'
import Item from './Item.js'

export class DependenciesTree extends Item {
  options = {
    path: []
  }

  processedData = {}
  nodesCount = 0

  constructor() {
    super('/api/dependencies')

    window.addEventListener('dependency-filter-applied-deps-tree', (e) => {
      this.options.path = (e.detail ? [] : [this.data.root])
      this.applyFilter('dependency', e.detail)
      this.processData()
    })
   
    this.treeWorker = new Worker('/js/workers/dependenciesTree.js')
    this.treeWorker.onmessage = (e) => {
      this.processedData = e.data.tree
      this.nodesCount = e.data.count
      super.loading = false
      this.render()
    }
  }

  processData() {
    super.loading = true
    // apply setting for initial render of first level deps
    if(!Object.keys(this.processedData).length) {
      this.options.path = [this.data.root]
    }
    this.treeWorker.postMessage([this.data, {
      target: this.filters['dependency'],
      ...this.options
    }])
    this.render()
  }

  setPath(path) {
    this.options.path = path
    this.applyFilter('dependency', '')
    path.length && this.processData()
  }

  addFilters(container) {
    const dependencyFilter = document.createElement('dependency-filter')
    dependencyFilter.id = 'deps-tree'

    container.append(dependencyFilter)
  }

  renderEmptyDataMessage() {
    const element = document.getElementById('layout-message')
    // adding
    if(element && (!this.options.filter || this.processedData)) {
      element.remove()
      return
    }
    // removing
    if(!element && this.options.filter && !this.processedData) { 
      const container = document.createElement('div')
      container.id = 'layout-message'
      container.textContent = 'No data to render. Try to increase depth or enter another filter request'
      this.append(container)
    }
  }

  renderPlot() {
    let element = document.getElementById('dependencies-plot')
    // creation
    if(!element) {
      element = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      element.id = 'dependencies-plot'
      this.append(element)
    }
   
    dependenciesPlot(this.processedData, element, this.setPath.bind(this))
  }

  render() {
    this.renderPlot()
    this.renderEmptyDataMessage()
  }
}