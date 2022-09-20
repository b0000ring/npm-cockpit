import Item from './Item.js'

export class UpdatesTable extends Item {
  constructor() {
    super('/api/updates')
  }

  renderTable() {
    let element = document.getElementById('updates-table')
    
  }

  render() {
    if(this.data) {
      this.renderTable()
    }
  }
}