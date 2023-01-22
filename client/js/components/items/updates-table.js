import Item from './Item.js'

const typeOptions = [
  'major', 'minor', 'patch'
]

export class UpdatesTable extends Item {
  constructor() {
    super('/api/updates')

    window.addEventListener('dependency-filter-applied-updates-list', (e) => {
      this.applyFilter('dependency', e.detail)
      this.renderTable()
    })

    window.addEventListener('custom-select-applied-updates-list-type', (e) => {
      this.applyFilter('type', e.detail)
      this.renderTable()
    })

    window.addEventListener('custom-select-applied-updates-list-updatable', (e) => {
      this.applyFilter('updatable', e.detail)
      this.renderTable()
    })

    this.updatesWorker = new Worker('/js/workers/updatesTable.js')
    this.updatesWorker.onmessage = (e) => {
      this.processedData = e.data
      super.loading = false
      this.render()
    }
  }

  processData() {
    super.loading = true
    this.updatesWorker.postMessage(this.data)
    this.render()
  }

  renderTable() {
    const element = this.querySelector('custom-table')
    element?.remove()

    const depFilter = this.filters.dependency
    const typeFilter = this.filters.type
    const updatableFilter = this.filters.updatable

    let data = this.processedData.filter((item) => {
      if(depFilter && !(item.name === depFilter)) {
        return false
      }

      if(typeFilter && !(item.type === typeFilter)) {
        return false
      }

      if(updatableFilter && !(item.updatable.toString() === updatableFilter)) {
        return false
      }

      return true
    })
    
    const table = document.createElement('custom-table')
    table.id = 'updates-table'
    table.__items__ = data
    table.__columns__ = {
      name: 'Name',
      current: 'Current',
      wanted: 'Wanted',
      latest: 'Latest',
      type: 'Type',
      updatable: 'Updatable'
    }
    table.__settings__ = {
      type: {
        color: {
          major: 'rgb(239, 83, 80)',
          minor: 'rgb(255, 152, 0)',
          patch: 'rgb(76, 175, 80)',
        }
      },
      updatable: {
        color: {
          true: 'rgb(76, 175, 80)',
          false: 'rgb(239, 83, 80)',
        }
      }
    }
    this.append(table) 
  }

  addFilters(container) {
    const dependencyFilter = document.createElement('dependency-filter')
    dependencyFilter.id = 'updates-list'

    const typeFilter = document.createElement('custom-select')
    typeFilter.id = 'updates-list-type'
    typeFilter.__options__ = typeOptions
    typeFilter.__placeholder__ = 'Select type'

    const updatable = document.createElement('custom-select')
    updatable.id = 'updates-list-updatable'
    updatable.__options__ = ['true', 'false']
    updatable.__placeholder__ = 'Updatable'

    container.append(dependencyFilter, typeFilter, updatable)
  }

  render() {
    if(this.processedData) {
      this.renderTable()
    }
  }
}