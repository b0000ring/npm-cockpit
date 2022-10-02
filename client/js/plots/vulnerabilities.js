let plot = null

const descriptions = {
  critical: 'Address immediately',
  high: 'Address as quickly as possible',
  moderate: 'Address as time allows',
  low: 'Address at your discretion',
}

export default function vulnerabilities({total, info, ...data}, svg) {
  if(!plot) {
    plot = d3.select(svg)
      .attr('width', '100%')
      .attr('height', '100%')

    plot.append('g')
      .attr('id', 'vulnerabilities-items')
    
    plot.append('text')
      .attr('id', 'vulnerabilities-text')
      .attr('x', `50%`)
      .attr('y', '50%')
  }

  const width = parseInt(plot.style('width'))
  const height = parseInt(plot.style('height'))
  const padding = 30
  const radius = Math.min(width, height) / 2 - padding

  const colorScale = d3.scaleOrdinal()
  .domain(['critical', 'high', 'moderate', 'low'])
  .range(['#F73E6C', '#FFC23D', '#FCFF82', '#43FAC3', '#2779FF'])

  const vulnerabilities = Object.entries(data)

  const pie = d3.pie()
    .value(d => d[1])
    .sort(null)
  const donut = d3.arc()
    .innerRadius(radius / 2)
    .outerRadius(radius)

  const pieData = pie(vulnerabilities)

  plot.attr('text-anchor', 'middle')
  const items = plot.select('#vulnerabilities-items')

  items.attr('transform', `translate(${width / 2}, ${height / 2})`)
    .selectAll('path')
    .data(pieData)
    .join('path')
    .attr('d', donut)
    .attr('fill', (d) => colorScale(d.data[0]))
    .on('mouseenter', function(e, d) {
      d3.select(this)
        .attr('opacity', '0.7')
      showDetails(e, d)
    })
    .on('mouseleave', function() {
      d3.select(this)
        .attr('opacity', '1')
      
      closeDetails()
    })

  plot.select('#vulnerabilities-text')
    .text(`Total: ${total}`)
    .attr('class', 'total')
    .attr('x', `50%`)
    .attr('y', '50%')

  function closeDetails() {
    window.dispatchEvent(
      new CustomEvent('popups-remove', {
        detail: 'group-data-popup'
      })
    )
  }

  function showDetails(event, obj) {
    const {x, y, width, height} = event.target.getBoundingClientRect()
    const details = obj.data

    window.dispatchEvent(
      new CustomEvent('popups-add', {
        detail: {
          popup: 'group-data-popup',
          options: {
            __data__: {
              name: details[0],
              count: details[1],
              description: descriptions[details[0]]
            },
            x: x + width / 2,
            y: y + height / 2
          }
        }
      })
    )
  }
}