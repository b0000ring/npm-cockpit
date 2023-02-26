import Item from './Item.js'
import donutPlot from '/js/plots/donut.js'

const plotConfig = {
  descriptions: {
    critical: 'Address immediately',
    high: 'Address as quickly as possible',
    moderate: 'Address as time allows',
    low: 'Address at your discretion',
  },
  types: ['critical', 'high', 'moderate', 'low'],
  colors: ['rgb(239, 83, 80)', 'rgb(255, 152, 0)', '#fbc02d', 'rgb(76, 175, 80)', '#2779FF'],
}

export class Vulnerabilities extends Item {
  constructor() {
    super('/api/vulnerabilities')
  }

  processData() {
    this.data = this.data.metadata?.vulnerabilities
  }

  renderPlot() {
    let element = document.getElementById('vulnerabilities-plot')
    // creation
    if(!element) {
      element = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      element.id = 'vulnerabilities-plot'
      this.append(element)
    }
    
    donutPlot(this.data, element, plotConfig)
  }

  resize() {
    this.render()
  }

  render() {
    if(this.data) {
      this.renderPlot()
    }
  }
}