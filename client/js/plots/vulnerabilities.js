import { showPopup } from './utils.js'

let plot = null

export default function vulnerabilities({total, ...data}, svg) {
  if(!plot) {
    plot = d3.select(svg)
      .attr('width', '100%')
      .attr('height', '100%')
  }

  const width = parseInt(plot.style('width'))
  const height = parseInt(plot.style('height'))
  const padding = 30
  const radius = Math.min(width, height) / 2 - padding

  const colorScale = d3.scaleOrdinal()
  .domain(['critical', 'high', 'moderate', 'low', 'info'])
  .range(['#E70000', '#EE6E00', '#FBE900', '#56F000', '#2779FF']);

  const vulnerabilities = Object.entries(data)

  console.log(vulnerabilities)

  const pie = d3.pie()
    .value(d => d[1])
    .sort(null)
  const donut = d3.arc()
    .innerRadius(radius / 2)
    .outerRadius(radius)

  const pieData = pie(vulnerabilities)

  plot.attr('text-anchor', 'middle')
  const items = plot.append('g')

  items.attr('transform', `translate(${width / 2}, ${height / 2})`)
    .selectAll('path')
    .data(pieData)
    .join('path')
    .attr('d', donut)
    .attr('fill', (d) => colorScale(d.data[0]))
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
      showPopup(items, x, y, {name: d.data[0], count: d.data[1]}, 20)
    })

  plot.append('text')
    .text(`total: ${total}`)
    .attr('x', `50%`)
    .attr('y', '50%')

}