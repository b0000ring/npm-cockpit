import { showPopup } from './utils.js'

export default function updates(data, svg) {
  const width = parseInt(svg.style('width'))
  const height = parseInt(svg.style('height'))
  const padding = 10
  const radius = Math.min(width, height) / 2 - padding

  let minor = 0
  let major = 0
  let none = 0

  data.forEach(item => {
    if(item.update === 'major') {
      major += 1
      return
    }
    if(item.update === 'minor') {
      minor += 1
      return
    }
    none += 1
  })

  const updates = [
    {name: 'minor', count: minor},
    {name: 'major', count: major},
    {name: 'none', count: none}
  ]

  const colorScale = d3.scaleOrdinal()
  .domain(['major', 'minor', 'none'])
  .range(['rgb(255, 106, 84)', 'rgb(103, 247, 94)', 'rgb(65, 125, 224)']);

  const pie = d3.pie()
    .value(d => d.count)
  const donut = d3.arc()
    .innerRadius(radius / 2)
    .outerRadius(radius)

  const pieData = pie(updates)

  svg.attr('text-anchor', 'middle')
  const items = svg.append('g')

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
      
      svg.select('#popup')
        .remove()
    })
    .on('mousemove', function(e, d) {
      const [x, y] = d3.pointer(e)
      showPopup(items, x, y, d.data, 20)
    })

  svg.append('text')
    .text(`updates available: ${minor + major}`)
    .attr('x', `50%`)
    .attr('y', '50%')

}