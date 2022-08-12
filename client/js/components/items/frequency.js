import Item from './Item.js'
import frequencyPlot from '/js/plots/frequency.js'

export class Frequency extends Item {
  constructor() {
    super('/api/statistic')
  }

  redraw() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const wrapper = d3.select(svg)
      .attr('width', '100%')
      .attr('height', '100%')

    this.appendChild(svg)
    frequencyPlot(this.data.data, wrapper)
  }
}