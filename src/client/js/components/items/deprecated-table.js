import Item from './Item.js'

export class DeprecatedTable extends Item {
  constructor() {
    super('/api/deprecated')

    window.addEventListener('dependency-filter-applied-deprecated-list', (e) => {
      this.applyFilter('dependency', e.detail)
      this.renderTable()
    })
  }

  processData() {
    super.loading = true
    this.processedData = Object.entries(this.data).map(item => {
      const [name, reason] = item
      return {
        name,
        reason
      }
    })

    super.loading = false
    this.render()
  }

  renderTable() {
    const element = this.querySelector('custom-table')
    element?.remove()

    const depFilter = this.filters.dependency

    let data = this.processedData.filter((item) => {
      if(depFilter && !(item.name === depFilter)) {
        return false
      }

      return true
    })
    
    const table = document.createElement('custom-table')
    table.id = 'updates-table'
    table.__items__ = data
    table.__columns__ = {
      name: 'Name',
      reason: 'Reason',
    }

    this.append(table) 
  }

  addFilters(container) {
    const dependencyFilter = document.createElement('dependency-filter')
    dependencyFilter.id = 'deprecated-list'

    container.append(dependencyFilter)
  }

  render() {
    this.processedData && this.renderTable()
  }
}