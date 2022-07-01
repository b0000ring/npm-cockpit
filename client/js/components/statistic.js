import { Page } from './page.js'
import { frequencyPlot, updatesPlot } from '../plots/statistic.js'

export class Statistic extends Page {
  constructor() {
    super()
    // how common are particular dependency is (bar chart)
    // ???only 10 most used???
    d3.select(this.wrapper)
      .append('svg')
      .attr('id', 'frequency')
      // should be attr to get correct value
      .attr('width', '100%')
      .style('height', '400px')

    // updates status (updated, has minor updates, has major updates) (donut chart)
    d3.select(this.wrapper)
      .append('svg')
      .attr('width', '400px')
      .style('height', '400px')
      .attr('id', 'updates')

    this.getData('/api/statistic').then(this.renderPlots.bind(this))
  }

  renderPlots() {
    // data.data is temporary
    // should be removed after real API implementation
    const frequencySvg = d3.select(this.wrapper).select('#frequency')
    const updatesSvg = d3.select(this.wrapper).select('#updates')
    frequencyPlot(this.data.data, frequencySvg)
    updatesPlot(this.data.data, updatesSvg)
  }
}