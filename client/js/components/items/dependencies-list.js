import Item from './Item.js'
import { makeRequest } from '../../utils.js'

export class DependenciesList extends Item {

  processedData = {}
  updates = {}
  vulnerabilities = {}

  constructor() {
    super('/api/dependencies')

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

  render() {
    if(!this.data) return

    const dependencies = this.processedData
    const items = Object.entries(dependencies)
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

    this.append(...items)
  }
}