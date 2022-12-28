import Item from './Item.js'

export class DependenciesList extends Item {

  processedData = {}

  constructor() {
    super('/api/dependencies')

    this.listWorker = new Worker('/js/workers/dependenciesList.js', { type: "module" })
    this.listWorker.onmessage = (e) => {
      this.processedData = e.data
      super.loading = false
      this.render()
    }
  }

  processData() {
    super.loading = true
    this.listWorker.postMessage(this.data)
    this.render()
  }

  render() {
    const items = []
    if(!this.data) return

    const dependencies = this.processedData
    Object.entries(dependencies)
      .sort((item1, item2) => item1[0].localeCompare(item2[0]))
      .forEach(dependency => {
        const [name, versions] = dependency
        const dependencyItem = document.createElement('dependency-item')
        dependencyItem.__data__ = {
          name,
          versions
        }
        items.push(dependencyItem)
      })

    this.append(...items)
  }
}