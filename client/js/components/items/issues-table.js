import Item from './Item.js'

export class IssuesTable extends Item {
  constructor() {
    super('/api/issues')

    this.issuesWorker = new Worker('/js/workers/issuesTable.js')
    this.issuesWorker.onmessage = (e) => {
      this.processedData = e.data
      super.loading = false
      this.render()
    }
  }

  processData() {
    super.loading = true
    this.issuesWorker.postMessage(this.data)
    this.render()
  }

  renderTable() {
    let element = document.getElementById('issues-table')
    if(!element) {
      const table = document.createElement('custom-table')
      table.id = 'issues-table'
      table.__items__ = this.processedData
      table.__columns__ = {
        lib: 'Name',
        version: 'Version',
        type: 'Type',
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