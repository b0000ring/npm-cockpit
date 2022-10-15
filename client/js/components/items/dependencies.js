import dependenciesPlot from '/js/plots/dependencies.js'
import Item from './Item.js'

export class Dependencies extends Item {
  options = {
    limitation: 1,
    filter: '',
    path: []
  }

  processedData = {}
  nodesCount = 0

  constructor() {
    super('/api/dependencies')
   
    this.treeWorker = new Worker('/js/workers/dependenciesTree.js')
    this.treeWorker.onmessage = (e) => {
      this.processedData = e.data.tree
      this.nodesCount = e.data.count
      super.loading = false
      this.render()
    }
  }

  filter() {
    const input = document.getElementById('dependenices-filter-input')
    const value = input.value
    if (!value) {
      this.options.filter = ''
    }
    this.options.filter = value
    this.processData()
  }

  processData() {
    super.loading = true
    this.treeWorker.postMessage([this.data, this.options])
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

  setPath(path) {
    this.options.path = path
    path.length && this.processData()
  }

  renderFilter() {
    const element = document.getElementById('dependencies-filter')
    // update
    if(element) {
      return
    }
    // creation
    const container = document.createElement('div')
    container.id = 'dependencies-filter'
    const input = document.createElement('input')
    input.id = 'dependenices-filter-input'
    input.setAttribute('placeholder', 'Name/Keyword/Author/Version')
    input.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        this.filter()
      }
    })
    const apply = document.createElement('button')
    apply.textContent = 'Filter'
    apply.addEventListener('click', () => this.filter())

    container.append(input, apply)
    this.append(container)
  }

  renderLimitation() {
    const element = document.getElementById('dependencies-limitation')
    // update
    if(element) {
      document.getElementById('dependencies-limitation-current')
        .textContent = `${this.options.limitation} / ${this.data?.depth}`
      document.getElementById('dependencies-limitation-reduce')
        .disabled = this.options.limitation < 1
      document.getElementById('dependencies-limitation-increase')
        .disabled = this.options.limitation >= this.data?.depth
      return
    }
    // creation
    const container = document.createElement('div')
    container.id = 'dependencies-limitation'
    const label = document.createElement('span')
    label.id = 'dependencies-limitation-depth'
    label.textContent = 'Depth: '
    const reduce = document.createElement('button')
    reduce.id = 'dependencies-limitation-reduce'
    reduce.addEventListener('click', () => {
      this.setPath([])
      this.changeDepth(-1)
    })
    reduce.textContent = '-'
    const increase = document.createElement('button')
    increase.id = 'dependencies-limitation-increase'
    increase.addEventListener('click', () => {
      this.setPath([])
      this.changeDepth(1)
    })
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
    this.renderInfo()
    this.renderFilter()
    this.renderPlot()
    this.renderEmptyDataMessage()
  }
}