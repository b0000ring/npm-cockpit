import Item from './Item.js'
import { makeRequest } from '../../utils.js'

export class DependenciesList extends Item {
  processedData = null
  updates = {}
  vulnerabilities = {}

  constructor() {
    super('/api/dependencies')

    window.addEventListener('dependency-filter-applied-dependencies-list', (e) => {
      this.applyFilter('dependency', e.detail)
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
    const deprecated = await makeRequest('/api/deprecated')
    const { vulnerabilities } = vulnerabilitiesData

    this.updates = updates
    this.vulnerabilities = vulnerabilities
    this.deprecated = deprecated

    this.listWorker.postMessage(this.data)
    this.render()
  }

  addFilters(container) {
    const dependencyFilter = document.createElement('dependency-filter')
    dependencyFilter.id = 'dependencies-list'

    container.append(dependencyFilter)
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
    const filter = this.filters['dependency']

    let items = Object.entries(dependencies)


    if(filter) {
      items = items.filter(item => item[0] === filter)
    }

    items = items.map(dependency => {
        const [name, versions] = dependency
        const dependencyItem = document.createElement('dependency-item')
        dependencyItem.addEventListener('click', (e) => {
          e.stopPropagation()
          const target = e.target['data-target']
          const dependency = e.target['data-dependency']

          if(!target) return

          window.dispatchEvent(
            new CustomEvent(`dashboard-scroll`, {detail: target})
          )

          window.dispatchEvent(
            new CustomEvent(`dependency-filter-applied-${target}`, {detail: dependency})
          )
        })

        if(this.updates[name]) dependencyItem.updatable = true
        if(this.vulnerabilities[name]) dependencyItem.vulnerable = true
        if(this.deprecated[name]) dependencyItem.deprecated = true
      
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
  }
}