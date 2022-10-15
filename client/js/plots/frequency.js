import { wrapText } from './utils.js'

let plot = null

//TODO refactor
export default function frequency(data, svg) {
  if(!plot) {
    plot = d3.select(svg)
      .attr('width', '100%')
      .attr('height', '100%')

    plot.append('g')
      .attr('id', 'frequency-yaxis')
      .attr('transform', 'translate(30, 0)')

    plot.append('g')
      .attr('id', 'frequency-xaxis')

    plot.append('g')
      .attr('id', 'frequency-items')
  }

  if(!data) {
    return
  }

  const margin = {left: 40, right: 40, top: 70, bottom: 70}
  const width = parseInt(plot.style('width'))
  const height = parseInt(plot.style('height'))
  const barWidth = (width - margin.left - margin.right) / data.length
  const max = d3.max(data, item => item[1].count)
  const scaleX = d3.scaleLinear().domain([0, data.length]).range([margin.left, width - margin.right])
  const scaleY = d3.scaleLinear().domain([0, max]).range([margin.top, height - margin.bottom])
  const colorScale = d3.scaleQuantize()
      .domain([0, data.length])
      .range([
        '#FFD0FD', '#FD97FF', '#E585FD', '#D765FF', 
        '#D14EFF', '#D52EFF', '#FF07F5', '#FF4FF8',
        '#FC68FF', '#FEB5FF'
      ]) 

  const axisY = d3.axisLeft(
    d3.scaleLinear().domain([0, max]).range([height - margin.top, margin.bottom])
  ).ticks(10, 'f')
  const axisX = d3.axisBottom(scaleX).ticks(data.length).tickFormat((d, i) => wrapText(data[i]?.[0], 10)).tickSize(0)

  const items = plot.select('#frequency-items')

  items.selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d, i) => scaleX(i))
    .attr('y', d => height - scaleY(d[1].count)) 
    .attr('width', barWidth)
    .attr('height', d => scaleY(d[1].count) - margin.bottom) 
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

  plot.select('#frequency-yaxis')
    .attr('transform', 'translate(30, 0)')
    .call(axisY)

  plot.select('#frequency-xaxis')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(axisX)
  plot.selectAll('#frequency-xaxis .tick text')
    .attr("transform", `translate(10, 20) rotate(-45)`)

  function closeDetails() {
    window.dispatchEvent(
      new CustomEvent('popups-remove', {
        detail: 'module-data-popup'
      })
    )
  }

  function showDetails(event, obj) {
    const {x, y, width, height} = event.target.getBoundingClientRect()
    const details = obj[1].data

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