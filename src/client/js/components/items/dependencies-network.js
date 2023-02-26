import dependenciesNetworkPlot from '/js/plots/dependencies-network.js'
import Item from './Item.js'

export class DependenciesNetwork extends Item {
  processedData = null
  plot = null

  constructor() {
    super('/api/dependencies')

    window.addEventListener('dependency-filter-applied-dependencies-network', (e) => {
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
    dependencyFilter.id = 'dependencies-network'

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

    if(this.plot) {
      this.plot(this.processedData, this.filters.dependency, this.data.root)
    } else {
      this.plot = dependenciesNetworkPlot(this.processedData, element, this.filters.dependency, this.data.root)
    }
  }

  render() {
    !super.loading && this.processedData && this.renderPlot()
  }
}