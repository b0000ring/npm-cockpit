export function frequencyPlot(data, svg) {
  const margin = {left: 40, right: 10, top: 50, bottom: 50}
  const width = parseInt(svg.style('width'))
  const height = parseInt(svg.style('height'))
  const barWidth = (width - margin.left - margin.right) / data.length
  const max = d3.max(data, item => item.count)
  const scaleX = d3.scaleLinear().domain([0, data.length]).range([margin.left, width - margin.right])
  const scaleY = d3.scaleLinear().domain([0, max]).range([margin.top, height - margin.bottom])
  const colorScale = d3.scaleSequential()
    .domain([0, data.length])
    .interpolator(d3.interpolateRainbow);
  const items = svg.append('g')

  const axisY = d3.axisLeft(
    d3.scaleLinear().domain([0, max]).range([height - margin.top, margin.bottom])
  ).ticks(max)

  const axisX = d3.axisBottom(scaleX).ticks(data.length).tickFormat((d, i) => data[i]?.name).tickSize(0)

  items.selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d, i) => scaleX(i))
    .attr('y', d => height - scaleY(d.count)) 
    .attr('width', barWidth)
    .attr('height', d => scaleY(d.count) - margin.bottom) 
    .attr('fill', (d, i) => colorScale(i))
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
      showPopup(svg, x, y, d)
    })


  svg.append('g')
    .attr('transform', 'translate(30, 0)')
    .call(axisY)

  svg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(axisX)
  
  // svg.selectAll('.tick line')
  //   .attr("transform", `translate(${barWidth / 2}, 0)`)
  svg.selectAll('#x-axis .tick text')
    .attr("transform", `translate(${-barWidth / 2}, 20) rotate(-45)`)

}


export function updatesPlot(data, svg) {
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

function showPopup(container, x, y, data, margin = 0) {
  container.select('#popup')
    .remove()
  
  const group = container.append('g')
    .attr('id', 'popup')
    .style('pointer-events', 'none')

  group.append('text')
    .text(`name: ${data.name}`)
    .attr('x', x + 15 + margin)
    .attr('y', y + 15 + margin)
  group.append('text')
    .text(`count: ${data.count}`)
    .attr('x', x + 15 + margin)
    .attr('y', y + 35 + margin)
}