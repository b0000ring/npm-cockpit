import Item from './Item.js'
import donutPlot from '/js/plots/donut.js'

const plotConfig = {
  descriptions: {
    major: 'Changes that break backward compatibility',
    minor: 'Backward compatible new features',
    patch: 'Backward compatible bug fixes'
  },
  types: ['major', 'minor', 'patch'],
  colors: ['rgb(239, 83, 80)', 'rgb(255, 152, 0)', 'rgb(76, 175, 80)']
}

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

  resize() {
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
   
    donutPlot(this.processedData, element, plotConfig)
  }

  render() {
    if(this.processedData) {
      this.renderPlot()
    }
  }
}