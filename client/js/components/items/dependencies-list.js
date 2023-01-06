import Item from './Item.js'
import { makeRequest } from '../../utils.js'

export class DependenciesList extends Item {
  processedData = null
  updates = {}
  vulnerabilities = {}
  filter = ''

  constructor() {
    super('/api/dependencies')

    window.addEventListener('dependency-filter-applied-deps-list', (e) => {
      this.filter = e.detail
      this.renderDependencies()
    })

    this.listWorker = new Worker('/js/workers/dependenciesList.js', { type: "module" })
    this.listWorker.onmessage = (e) => {
      this.processedData = e.data
      super.loading = false
      this.render()
    }
  }

  async processData() {
    super.loading = true

    const vulnerabilitiesData = await makeRequest('/api/vulnerabilities')
    const updates = await makeRequest('/api/updates')
    const { vulnerabilities } = vulnerabilitiesData

    this.updates = updates
    this.vulnerabilities = vulnerabilities

    this.listWorker.postMessage(this.data)
    this.render()
  }

  renderFilters() {
    const element = this.querySelector('.dependencies-list_filters')
    if(element) {
      return
    }

    const filters = document.createElement('div')
    filters.className = 'dependencies-list_filters'

    const dependencyFilter = document.createElement('dependency-filter')
    dependencyFilter.id = 'deps-list'
    
    filters.append(dependencyFilter)
    this.append(filters)
  }

  renderDependencies() {
    let dependenciesList = this.querySelector('.dependencies-list_list')

    if(!dependenciesList) {
      dependenciesList = document.createElement('div')
      dependenciesList.className = 'dependencies-list_list'
    }

    // clear before re-render
    dependenciesList.textContent = ''

    const dependencies = this.processedData
    const items = Object.entries(dependencies)
      .filter(item => this.filter ? item[0] === this.filter : true)
      .map(dependency => {
        const [name, versions] = dependency
        const dependencyItem = document.createElement('dependency-item')
        if(this.updates[name]) dependencyItem.updatable = true
        if(this.vulnerabilities[name]) dependencyItem.vulnerable = true
        dependencyItem.__data__ = {
          name,
          versions
        }
        return dependencyItem
      })

    dependenciesList.append(...items)
    this.append(dependenciesList)
  }

  render() {
    if(!this.processedData) return
    
    this.renderDependencies()
    this.renderFilters()
  }
}