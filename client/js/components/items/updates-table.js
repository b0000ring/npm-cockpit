import Item from './Item.js'

export class UpdatesTable extends Item {
  constructor() {
    super('/api/updates')

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
    let element = document.getElementById('updates-table')
    if(!element) {
      const table = document.createElement('custom-table')
      table.id = 'updates-table'
      table.__items__ = this.processedData
      table.__columns__ = {
        name: 'Name',
        current: 'Current',
        wanted: 'Wanted',
        latest: 'Latest',
        type: 'Type'
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