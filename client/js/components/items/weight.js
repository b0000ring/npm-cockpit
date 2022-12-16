import Item from './Item.js'
import weightPlot from '/js/plots/weight.js'

export class Weight extends Item {
  constructor() {
    super('/api/dependencies')

    this.frequencyWorker = new Worker('/js/workers/weight.js')
    this.frequencyWorker.onmessage = (e) => {
      this.processedData = e.data
      super.loading = false
      this.render()
    }
  }

  resize() {
    this.render()
  }

  processData() {
    super.loading = true
    this.frequencyWorker.postMessage(this.data)
    this.render()
  }

  renderPlot() {
    let element = document.getElementById('weight-plot')
    // creation
    if(!element) {
      element = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      element.id = 'weight-plot'
      this.append(element)
    }
   
    weightPlot(this.processedData, element)
  }

  render() {
    this.renderPlot()
  }
}