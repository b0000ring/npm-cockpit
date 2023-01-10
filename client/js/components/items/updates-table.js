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

    const depFilter = this.filters['dependency']
    const typeFilter = this.filters['type']

    let data = this.processedData.filter((item) => {
      if(depFilter && !(item.name === depFilter)) {
        return false
      }

      if(typeFilter && !(item.type === typeFilter)) {
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
      type: 'Type'
    }
    table.__settings__ = {
      type: {
        color: {
          major: 'rgb(239, 83, 80)',
          minor: 'rgb(255, 152, 0)',
          patch: 'rgb(76, 175, 80)',
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

    container.append(dependencyFilter, typeFilter)
  }

  render() {
    if(this.processedData) {
      this.renderTable()
    }
  }
}