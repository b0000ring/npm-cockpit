import { wrapText } from './utils.js'

export default function bar(data = [], svg) {
  const plot = d3.select(svg)
  const margin = {left: 160, right: 30, top: 60, bottom: 30}
  const width = parseInt(plot.style('width'))
  const height = parseInt(plot.style('height'))
  const barHeight = (height - margin.top - margin.bottom) / data.length
  const max = d3.max(data, item => item.count)
  const scaleX = d3.scaleLinear().domain([0, max]).range([margin.left, width - margin.right])
  const scaleY = d3.scaleLinear().domain([0, data.length]).range([margin.top, height - margin.bottom])
  const colorScale = d3.scaleQuantize()
      .domain([0, data.length])
      .range([
        '#2F2B58', '#29376B', '#28407C', '#28579E', 
        '#2D74B6', '#0293C0', '#23AFCE', '#1DCDD9',
        '#57EBF0', '#8AF8F8'
      ]) 

  const axisY = d3.axisLeft(scaleY)
    .ticks(data.length)
    .tickFormat((d, i) => wrapText(data[i]?.data.name, 20))
    .tickSize(0)
  
  const axisX = d3.axisBottom(scaleX)
    .ticks(max < 10 ? max : 10, 'd')

  const items = plot.select('#bar-items')
  
  // initial render
  if(!plot.selectChildren().size()) {
    plot.attr('width', '100%')
      .attr('height', '100%')

    plot.append('g')
      .attr('id', 'bar-items')

    plot.append('g')
      .attr('id', 'bar-yaxis')
      .attr('class', 'axis')
      .attr('transform', 'translate(30, 0)')

    plot.append('g')
      .attr('id', 'bar-xaxis')
      .attr('class', 'axis')
  }

  items.selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d, i) => scaleX(0))
    .attr('y', (d, i) => scaleY(i)) 
    .attr('width', d => scaleX(d.count) - margin.left)
    .attr('height', barHeight) 
    .attr('fill', (d, i) => colorScale(i))
    .on('mouseenter', function(e, d) {
      showDetails(e, d)
      d3.select(this)
        .attr('opacity', '0.9')
    })
    .on('mouseleave', function() {
      d3.select(this)
        .attr('opacity', '1')
      
      closeDetails()
    })

  plot.select('#bar-yaxis')
    .attr('transform', 'translate(150, 0)')
    .call(axisY)

  plot.selectAll('#bar-yaxis .tick text')
    .attr('transform', `translate(-5, ${barHeight / 2})`)

  plot.select('#bar-xaxis')
    .attr('transform', `translate(0, ${height - margin.bottom + 5})`)
    .call(axisX)


  function closeDetails() {
    window.dispatchEvent(
      new CustomEvent('popups-remove', {
        detail: 'module-data-popup'
      })
    )
  }

  function showDetails(event, obj) {
    const {x, y, width, height} = event.target.getBoundingClientRect()
    const details = obj.data

    window.dispatchEvent(
      new CustomEvent('popups-add', {
        detail: {
          popup: 'module-data-popup',
          options: {
            __data__: details,
            x: x + width / 2,
            y: y + height / 2
          }
        }
      })
    )
  }
}