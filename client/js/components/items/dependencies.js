import dependenciesPlot from '/js/plots/dependencies.js'
import Item from './Item.js'

export class Dependencies extends Item {
  constructor() {
    super('/api/dependencies')
  }

  redraw() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const wrapper = d3.select(svg)
      .attr('width', '100%')
      .attr('height', '100%')

    this.appendChild(svg)
    dependenciesPlot(this.data, wrapper)
  }
}