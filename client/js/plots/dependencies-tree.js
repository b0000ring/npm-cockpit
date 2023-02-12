let plot = null

// TODO refactor
export default function dependencies(data, svg, setPath) {
  if(!data) {
    plot.select('#plot-content').selectAll('*').remove()
    return 
  }
  const nodeRadius = 20
  const nodeHeight = 50
  const nodeWidth = 100
  const nodeSeparation = 100

  const nodes = d3.hierarchy(data, d => d.deps)
  const lnkMkr = d3.linkHorizontal().x(d => d.y).y(d => d.x)
  if(!plot) {
    plot = d3.select(svg)
      .attr('width', '100%')
      .attr('height', '100%')

    const height = parseInt(plot.style('height'))
    const width = parseInt(plot.style('width'))

    const zoom = d3.zoom()
      .extent([[0, 0], [width, height]])
      .on('zoom', zoomed)

    plot.append('defs')
      .append('circle')
      .attr('id', 'node')
      .attr('r', nodeRadius)
      .style('stroke', '#63a3ee')
      .style('stroke-width', '1')
      .style('rx', '10')
      .style('ry', '10')
      .style('box-shadow', '5px 10px')
    
    plot.append('g')
      .attr('id', 'plot-content')

    // applying zoom
    plot
      // setting default zoom values
      .call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.5))
      .call(zoom)
  }

  const g = plot.select('#plot-content')

  g.selectAll('*').remove()

  d3.tree().nodeSize([nodeHeight + nodeSeparation, nodeWidth + nodeSeparation * 5])(nodes)

  g.selectAll('path').data(nodes.links()).enter()
    .append('path').attr('d', d => lnkMkr(d))
    .attr('stroke', '#e0e4e7').attr('fill', 'none')
      
  const selection = g.selectAll('g').data(nodes.descendants()).enter()
  renderItem(selection)

  function closeDetails() {
    window.dispatchEvent(
      new CustomEvent('popups-remove', {
        detail: 'module-data-popup'
      })
    )
  }

  function renderItem(selection) {
    const g = selection.append('g')

    g.append('use')
      .attr('href', '#node')
      .attr('stroke-width', 2)
      .attr('x', d => d.y).attr('y', d => d.x)
      .attr('fill', d => d.data.error ? '#F73E6C' : '#5ca9f8')
      .style('cursor', d => d.data.connections?.length > 0 ? 'pointer' : 'default')
      .attr('text-anchor', 'start')
      .on('mouseenter', function (e, d) {
        showDetails(e, d)
        d3.select(this).select('use')
          .attr('opacity', 0.9)
      })
      .on('mouseleave', function() {
        closeDetails()
        d3.select(this).select('use')
          .attr('opacity', 1)
      })
      .on('click', function(e, d) {
        if(d.data.connections.length === 0) return
        const path = nodes.path(d)
        setPath(path.map(item => item.data.name))
      })
      
    g.append('text')
      .attr('x', d => d.y - 25)
      .attr('y', d => d.x + 5)
      .attr('text-anchor', 'end')
      .text(d => d.data.name)
      .style('font-family', 'Arimo')
      .style('font-size', '24px')
      .attr('fill', '#9d9d9d')
  }

  function showDetails(event, obj) {
    const shift = 10 
    const {width, height} = event.target.getBoundingClientRect()
    const x = event.clientX
    const y = event.clientY
    const details = obj.data
    window.dispatchEvent(
      new CustomEvent('popups-add', {
        detail: {
          popup: 'module-data-popup',
          options: {
            __data__: details,
            x: x + width + shift,
            y: y + height + shift
          }
        }
      })
    )
  }

  function zoomed({ transform }) {
    closeDetails()
    plot.select('#plot-content').attr('transform', transform)
  }
}

