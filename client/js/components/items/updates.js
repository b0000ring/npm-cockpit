import Item from './Item.js'
import updatesPlot from '/js/plots/updates.js'

export class Updates extends Item {
  constructor() {
    super('/api/statistic')
  }

  render() {
    // const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    // const wrapper = d3.select(svg)
    //   .attr('width', '100%')
    //   .attr('height', '100%')

    // this.appendChild(svg)
    // updatesPlot(this.data.data, wrapper)
  }
}