import { Page } from './page.js'
import { dependenciesPlot } from '../plots/dependencies.js'
export class Dependencies extends Page {
  constructor() {
    super()

    d3.select(this.wrapper)
      .append('svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('style', 'position: relative;')
      .style('width', '100%')
      .style('height', '640px')
      .style('cursor', 'pointer')
      .style('filter', 'drop-shadow(2px 2px 2px grey)')

    this.getData('/api/dependencies').then(this.renderPlot.bind(this))
  }

  renderPlot() {
    const svg =  d3.select(this.wrapper).select('svg')
    dependenciesPlot(this.data, svg)
  }
}