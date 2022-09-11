import { showPopup } from './utils.js'

let plot = null

export default function updates(data, svg) {
  if(!plot) {
    plot = d3.select(svg)
      .attr('width', '100%')
      .attr('height', '100%')
  }

  const width = parseInt(plot.style('width'))
  const height = parseInt(plot.style('height'))
  const padding = 30
  const radius = Math.min(width, height) / 2 - padding

  const updates = [
    {name: 'major', count: data.major},
    {name: 'minor', count: data.minor},
    {name: 'patch', count: data.patch}
  ]

  const colorScale = d3.scaleOrdinal()
  .domain(['major', 'minor', 'patch'])
  .range(['rgb(255, 106, 84)', 'rgb(103, 247, 94)', 'rgb(65, 125, 224)']);

  const pie = d3.pie()
    .value(d => d.count)
  const donut = d3.arc()
    .innerRadius(radius / 2)
    .outerRadius(radius)

  const pieData = pie(updates)

  plot.attr('text-anchor', 'middle')
  const items = plot.append('g')

  items.attr('transform', `translate(${width / 2}, ${height / 2})`)
    .selectAll('path')
    .data(pieData)
    .join('path')
    .attr('d', donut)
    .attr('fill', (d) => colorScale(d.data.name))
    .on('mouseenter', function() {
      d3.select(this)
        .attr('opacity', '0.7')
    })
    .on('mouseleave', function() {
      d3.select(this)
        .attr('opacity', '1')
      
      plot.select('#popup')
        .remove()
    })
    .on('mousemove', function(e, d) {
      const [x, y] = d3.pointer(e)
      showPopup(items, x, y, d.data, 20)
    })

  plot.append('text')
    .text(`total: ${data.minor + data.major + data.patch}`)
    .attr('x', `50%`)
    .attr('y', '50%')

}