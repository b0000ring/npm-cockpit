import { showPopup } from './utils.js'

export default function frequency(data, svg) {
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