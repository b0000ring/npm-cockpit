import dependenciesPlot from '/js/plots/dependencies.js'
import Item from './Item.js'

export class Dependencies extends Item {
  options = {
    limitation: 1
  }

  searchResult = []
  processedData = {}

  constructor() {
    super('/api/dependencies')

    this.treeWorker = new Worker('/js/workers/dependenciesTree.js')
    this.treeWorker.onmessage = function(e) {
      this.processedData = e.data
      this.loading = false
      this.render()
    }.bind(this)
  }

  search() {
    // webworkers
  }

  processData() {
    this.loading = true
    this.treeWorker.postMessage([this.data, this.options]);
  }

  redraw() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const wrapper = d3.select(svg)
      .attr('width', '100%')
      .attr('height', '100%')

    this.appendChild(svg)
    dependenciesPlot(this.processedData, wrapper)
  }
}