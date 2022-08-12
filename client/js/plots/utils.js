export function showPopup(container, x, y, data, margin = 0) {
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