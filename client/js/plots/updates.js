let plot = null

const descriptions = {
  major: 'Changes that break backward compatibility',
  minor: 'Backward compatible new features',
  patch: 'Backward compatible bug fixes'
}

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
  .range(['#E70000', '#FBE900', '#2779FF']);

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

  plot.append('text')
    .text(`total: ${data.minor + data.major + data.patch}`)
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
              ...details,
              description: descriptions[details.name]
            },
            x: x + width / 2,
            y: y + height / 2
          }
        }
      })
    )
  }
}