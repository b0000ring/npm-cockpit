import Item from './Item.js'
import updatesPlot from '/js/plots/updates.js'

export class Updates extends Item {
  constructor() {
    super('/api/updates')

    this.updatesWorker = new Worker('/js/workers/updates.js')
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

  renderPlot() {
    let element = document.getElementById('updates-plot')
    // creation
    if(!element) {
      element = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      element.id = 'updates-plot'
      this.append(element)
    }
   
    updatesPlot(this.processedData, element)
  }

  render() {
    if(this.processedData) {
      this.renderPlot()
    }
  }
}