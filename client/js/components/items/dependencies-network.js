import dependenciesNetworkPlot from '/js/plots/dependencies-network.js'
import Item from './Item.js'

export class DependenciesNetwork extends Item {
  processedData = {}

  constructor() {
    super('/api/dependencies')

    window.addEventListener('dependency-filter-applied-deps-network', (e) => {
      this.applyFilter('dependency', e.detail)
      this.processData()
    })
   
    this.treeWorker = new Worker('/js/workers/dependenciesNetwork.js')
    this.treeWorker.onmessage = (e) => {
      this.processedData = e.data.network
      super.loading = false
      this.render()
    }
  }

  processData() {
    super.loading = true
    this.treeWorker.postMessage([this.data, this.filters.dependency])
    this.render()
  }

  addFilters(container) {
    const dependencyFilter = document.createElement('dependency-filter')
    dependencyFilter.id = 'deps-network'

    container.append(dependencyFilter)
  }

  renderPlot() {
    let element = document.getElementById('dependencies-network-plot')
    // creation
    if(!element) {
      element = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      element.id = 'dependencies-network-plot'
      this.append(element)
    }
   
    dependenciesNetworkPlot(this.processedData, element)
  }

  render() {
    this.renderPlot()
  }
}