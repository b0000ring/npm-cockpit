import dependenciesPlot from '/js/plots/dependencies.js'
import Item from './Item.js'

export class Dependencies extends Item {
  options = {
    limitation: 1
  }

  searchResult = []
  processedData = {}
  nodesCount = 0

  constructor() {
    super('/api/dependencies')

    this.treeWorker = new Worker('/js/workers/dependenciesTree.js')
    this.treeWorker.onmessage = function(e) {
      this.processedData = e.data.tree
      this.nodesCount = e.data.count
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

  changeDepth(direction) {
    if(direction < 0 && this.options.limitation < 1) {
      return
    }

    if(direction > 0 && this.nodesCount > 100 && !window.confirm('The big amount of nodes to show can degrade performance. Continue?')) {
      return
    }

    this.options.limitation += direction
    this.processData()
  }

  applySearch() {
    const input = document.getElementById('dependenices-search-input')
    const value = input.value
    console.log(value)
    if (!value) {
      return
    }
  }

  renderSearch() {
    const container = document.createElement('div')
    container.className = 'search'
    const input = document.createElement('input')
    input.id = 'dependenices-search-input'
    input.setAttribute('placeholder', 'Search by name, tag, author')
    input.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        this.applySearch()
      }
    });
    const apply = document.createElement('button')
    apply.textContent = 'Search'
    apply.addEventListener('click', () => this.applySearch())

    container.append(input, apply)

    return container
  }

  renderLimitationInterface() {
    const container = document.createElement('div')
    container.className = 'limitation'

    const label = document.createElement('span')
    label.textContent = 'Depth:'
    const reduce = document.createElement('button')
    reduce.addEventListener('click', () => this.changeDepth(-1))
    reduce.textContent = '-'
    const increase = document.createElement('button')
    increase.addEventListener('click', () => this.changeDepth(1))
    increase.textContent = '+'
    const current = document.createElement('div')
    current.textContent = this.options.limitation

    container.append(label, reduce, current, increase)

    return container
  }

  renderInfo() {
    const container = document.createElement('div')
    container.className = 'dependencies-info'

    const nodesCount = document.createElement('div')
    nodesCount.className = 'nodes-count'
    nodesCount.textContent = 'Rendered nodes: ' + this.nodesCount

    const limitation = this.renderLimitationInterface()

    container.append(nodesCount, limitation)
    return container
  }

  redraw() {
    const info = this.renderInfo()
    const search = this.renderSearch()
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const wrapper = d3.select(svg)
      .attr('width', '100%')
      .attr('height', '100%')

    this.append(info, search, svg)
    dependenciesPlot(this.processedData, wrapper)
  }
}