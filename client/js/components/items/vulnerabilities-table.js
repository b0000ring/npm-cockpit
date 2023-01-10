import Item from './Item.js'

export class VulnerabilitiesTable extends Item {
  constructor() {
    super('/api/vulnerabilities')

    window.addEventListener('dependency-filter-applied-vulnerabilities-list', (e) => {
      this.applyFilter('dependency', e.detail)
      this.renderTable()
    })

    window.addEventListener('custom-select-applied-vuln-list-severity', (e) => {
      this.applyFilter('severity', e.detail)
      this.renderTable()
    })

    window.addEventListener('custom-select-applied-vuln-list-fix', (e) => {
      this.applyFilter('fix', e.detail)
      this.renderTable()
    })

    this.vulnerabilitiesWorker = new Worker('/js/workers/vulnerabilitiesTable.js')
    this.vulnerabilitiesWorker.onmessage = (e) => {
      this.processedData = e.data
      super.loading = false
      this.render()
    }
  }

  processData() {
    super.loading = true
    this.vulnerabilitiesWorker.postMessage(this.data.vulnerabilities)
    this.render()
  }

  renderTable() {
    const element = this.querySelector('custom-table')
    element?.remove()

    const depFilter = this.filters['dependency']
    const severityFilter = this.filters['severity']
    const fixFilter = this.filters['fix']

    let data = this.processedData.filter((item) => {
      if(depFilter && !(item.name === depFilter)) {
        return false
      }

      if(severityFilter && !(item.severity === severityFilter)) {
        return false
      }

      if(fixFilter && !(item.fixAvailable?.toString() === fixFilter)) {
        return false
      }

      return true
    })
    

    const table = document.createElement('custom-table')
    table.id = 'vulnerabilities-table'
    table.__items__ = data
    table.__columns__ = {
      name: 'Name',
      severity: 'Severity',
      fixAvailable: 'Fix Available'
    }
    table.__settings__ = {
      severity: {
        color: {
          critical: 'rgb(239, 83, 80)',
          high: 'rgb(255, 152, 0)',
          moderate: '#fbc02d',
          low: 'rgb(76, 175, 80)'
        }
      },
      fixAvailable: {
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
    dependencyFilter.id = 'vulnerabilities-list'

    const severityFilter = document.createElement('custom-select')
    severityFilter.id = 'vuln-list-severity'
    severityFilter.__options__ = [
      'critical',
      'high',
      'moderate',
      'low'
    ]
    severityFilter.__placeholder__ = 'Select severity'

    const fixFilter = document.createElement('custom-select')
    fixFilter.id = 'vuln-list-fix'
    fixFilter.__options__ = ['true', 'false']
    fixFilter.__placeholder__ = 'Fix available'

    container.append(dependencyFilter, severityFilter, fixFilter)
  }

  render() {
    if(this.processedData) {
      this.renderTable()
    }
  }
}