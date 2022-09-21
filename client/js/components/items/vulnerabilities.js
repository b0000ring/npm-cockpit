import Item from './Item.js'
import vulnerabilitiesPlot from '/js/plots/vulnerabilities.js'

export class Vulnerabilities extends Item {
  constructor() {
    super('/api/vulnerabilities')
  }

  processData() {
    this.data = this.data.metadata.vulnerabilities
  }

  renderPlot() {
    let element = document.getElementById('vulnerabilities-plot')
    // creation
    if(!element) {
      element = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      element.id = 'vulnerabilities-plot'
      this.append(element)
    }
    
    console.log(this.data)
    vulnerabilitiesPlot(this.data, element)
  }

  render() {
    if(this.data) {
      this.renderPlot()
    }
  }
}