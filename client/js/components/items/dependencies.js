import dependenciesPlot from '/js/plots/dependencies.js'
import Item from './Item.js'

export class Dependencies extends Item {
  options = {
    limitation: 1,
    search: '',
  }

  processedData = {}
  nodesCount = 0

  constructor() {
    super('/api/dependencies')
   
    this.treeWorker = new Worker('/js/workers/dependenciesTree.js')
    this.treeWorker.onmessage = (e) => {
      this.processedData = e.data.tree
      this.nodesCount = e.data.count
      this.loading = false
      this.render()
    }
  }

  search() {
    const input = document.getElementById('dependenices-search-input')
    const value = input.value
    if (!value) {
      this.options.search = ''
    }
    this.options.search = value
    this.processData()
  }

  processData() {
    this.loading = true
    this.treeWorker.postMessage([this.data, this.options]);
    this.render()
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

  renderSearch() {
    const element = document.getElementById('dependencies-search')
    // update
    if(element) {
      return
    }
    // creation
    const container = document.createElement('div')
    container.id = 'dependencies-search'
    const input = document.createElement('input')
    input.id = 'dependenices-search-input'
    input.setAttribute('placeholder', 'Search by name, keyword, author')
    input.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        this.search()
      }
    });
    const apply = document.createElement('button')
    apply.textContent = 'Search'
    apply.addEventListener('click', () => this.search())

    container.append(input, apply)
    this.append(container)
  }

  renderLimitation() {
    const element = document.getElementById('dependencies-limitation')
    // update
    if(element) {
      document.getElementById('dependencies-limitation-current')
        .textContent = this.options.limitation
      return
    }
    // creation
    const container = document.createElement('div')
    container.id = 'dependencies-limitation'

    const label = document.createElement('span')
    label.textContent = 'Depth:'
    const reduce = document.createElement('button')
    reduce.addEventListener('click', () => this.changeDepth(-1))
    reduce.textContent = '-'
    const increase = document.createElement('button')
    increase.addEventListener('click', () => this.changeDepth(1))
    increase.textContent = '+'
    const current = document.createElement('div')
    current.id = 'dependencies-limitation-current'
    current.textContent = this.options.limitation

    container.append(label, reduce, current, increase)
    return container
  }

  renderInfo() {
    const element = document.getElementById('dependencies-info')
    // update
    if(element) {
      document.getElementById('dependencies-nodes-count')
        .textContent = 'Rendered nodes: ' + this.nodesCount
      this.renderLimitation()
      return
    }
    // creation
    const container = document.createElement('div')
    container.id = 'dependencies-info'

    const nodesCount = document.createElement('div')
    nodesCount.id = 'dependencies-nodes-count'
    nodesCount.textContent = 'Rendered nodes: ' + this.nodesCount

    const limitation = this.renderLimitation(container)

    container.append(nodesCount, limitation)
    this.append(container)
  }

  renderEmptyDataMessage() {
    const element = document.getElementById('layout-message')
    // adding
    if(element && (!this.options.search || this.processedData)) {
      element.remove()
      return
    }
    // removing
    if(!element && this.options.search && !this.processedData) { 
      const container = document.createElement('div')
      container.id = 'layout-message'
      container.textContent = 'No data to render. Try to increase depth or enter another search request'
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
   
    dependenciesPlot(this.processedData, element)
  }

  render() {
    this.renderInfo()
    this.renderSearch()
    this.renderPlot()
    this.renderEmptyDataMessage()

    // make loading as a layout to avoid re-rendering of entire interface
    // re-draw existed d3 plot insted creating of new each re render
   
  
  }
}