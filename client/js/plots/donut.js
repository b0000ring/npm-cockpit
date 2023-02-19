export default function donut(data, svg, config) {
  let plot = d3.select(svg)

  // initial render
  if(plot) {
    plot
      .attr('width', '100%')
      .attr('height', '100%')

    plot.append('g')
      .attr('id', 'donut-items')
    
    plot.append('text')
      .attr('id', 'donut-text')
      .attr('x', `50%`)
      .attr('y', '50%')
  }

  const width = parseInt(plot.style('width'))
  const height = parseInt(plot.style('height'))
  const padding = 50
  const radius = Math.min(width, height) / 2 - padding

  const colorScale = d3.scaleOrdinal()
  .domain(config.types)
  .range(config.colors)

  const pie = d3.pie()
    .value(d => d.count)
  const donut = d3.arc()
    .innerRadius(radius / 2)
    .outerRadius(radius)

  const pieData = pie(config.types.map(item => ({name: item, count: data[item]})))

  plot.attr('text-anchor', 'middle')
  const items = plot.select('#donut-items')

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

  plot.select('#donut-text')
    .text(`Total: ${config.types.reduce((sum, item) => sum += data[item], 0)}`)
    .attr('class', 'total')

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
              description: config.descriptions[details.name]
            },
            x: x + width / 2,
            y: y + height / 2
          }
        }
      })
    )
  }
}