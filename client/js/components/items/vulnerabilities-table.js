import Item from './Item.js'

export class VulnerabilitiesTable extends Item {
  constructor() {
    super('/api/vulnerabilities')

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
    let element = document.getElementById('vulnerabilities-table')
    if(!element) {
      const table = document.createElement('custom-table')
      table.id = 'vulnerabilities-table'
      table.__items__ = this.processedData
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
  }

  render() {
    if(this.processedData) {
      this.renderTable()
    }
  }
}