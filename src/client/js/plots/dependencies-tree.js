export default function dependencies(data, svg, setPath) {
  let plot = d3.select(svg)
    .attr('width', '100%')
    .attr('height', '100%')

  const nodeRadius = 20
  const nodeHeight = 50
  const nodeWidth = 100
  const nodeSeparation = 100
  const lnkMkr = d3.linkHorizontal().x(d => d.y).y(d => d.x)
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

  const buttons = plot.append('g')
  const content = plot.append('g')
    .attr('id', 'plot-content')
  content.append('g')
    .attr('id', 'paths')
  content.append('g')
    .attr('id', 'nodes')

  defaultZoom()

  // applying center plot button
  buttons.append('image')
    .attr('xlink:href','/static/center-icon.svg')
    .attr('id', 'center-icon')
    .on('click', function() {
      defaultZoom()
    })
    // numbers are slight moving for better positioning
    .attr('transform', `translate(${width - 40}, 16)`)
    .append('title')
    .text('Center plot')


  render(data)

  return render

  function defaultZoom() {
    plot
      // setting default zoom values
      .call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.5))
      .call(zoom)
  }

  function render(data) {
    const nodes = d3.hierarchy(data, d => d.deps)
    const pathsContainer = plot.select('#paths')
    const nodesContainer = plot.select('#nodes')

    d3.tree().nodeSize([nodeHeight + nodeSeparation, nodeWidth + nodeSeparation * 5])(nodes)

    pathsContainer.selectAll('path')
      .data(nodes.links())
      .join('path')
      .attr('d', d => lnkMkr(d))
      .attr('stroke-width', 2)
      .attr('stroke', 'var(--path)')
      .attr('fill', 'none')
        
    nodesContainer.selectAll('g')
      .data(nodes.descendants(), d => `${d.data.name}@${d.data.version}`)
      .join(
        enter => {
          renderItem(enter.append('g').attr('transform', d => `translate(${d.y},${d.x})`), nodes)
        },
        update => update.attr('transform', d => `translate(${d.y},${d.x})`),
        exit => exit.remove()
      )
  }

  function closeDetails() {
    window.dispatchEvent(
      new CustomEvent('popups-remove', {
        detail: 'module-data-popup'
      })
    )
  }

  function renderItem(selection, nodes) {
    selection.append('use')
      .attr('href', '#node')
      .attr('stroke-width', 2)
      .attr('x', d => 0)
      .attr('y', 0)
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
        closeDetails()
        if(d.data.connections.length === 0) return
        const path = nodes.path(d)
        setPath(path.map(item => item.data.name))
      })
      
    selection.append('text')
      .attr('x', -25)
      .attr('y', 5)
      .attr('text-anchor', 'end')
      .text(d => d.data.name)
      .style('font-family', 'Arimo')
      .style('font-size', '24px')
      .attr('fill', '#9d9d9d')

    return selection
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

