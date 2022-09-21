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
      this.append(table)
    }
  }

  render() {
    if(this.processedData) {
      this.renderTable()
    }
  }
}