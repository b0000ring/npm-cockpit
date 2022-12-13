import Item from './Item.js'
import frequencyPlot from '/js/plots/frequency.js'

export class Frequency extends Item {
  constructor() {
    super('/api/dependencies')

    this.frequencyWorker = new Worker('/js/workers/frequency.js')
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
    let element = document.getElementById('frequency-plot')
    // creation
    if(!element) {
      element = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      element.id = 'frequency-plot'
      this.append(element)
    }
   
    frequencyPlot(this.processedData, element)
  }

  render() {
    this.renderPlot()
  }
}