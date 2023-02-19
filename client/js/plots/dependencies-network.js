function dependenciesNetworkPlot({ nodes, links }, svg, target, root) {
  let simulation = null
  const plot = d3.select(svg)
    .attr('width', '100%')
    .attr('height', '100%')
    
  const height = parseInt(plot.style('height'))
  const width = parseInt(plot.style('width'))

  const g = plot.append('g')
    .attr('id', 'plot-content')

  const zoom = d3.zoom()
    .extent([[0, 0], [width, height]])
    .on('zoom', zoomed)

  // applying zoom
  plot
    // setting default zoom values
    .call(zoom.transform, d3.zoomIdentity.translate(40, height / 4).scale(0.5))
    .call(zoom)

  plot.append('defs')
    .append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', '5')
    .attr('refY', '5')
    .attr('markerWidth', '6')
    .attr('markerHeight', '6')
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 10 z')
    .style('stroke', 'var(--path)')
    .style('fill', 'var(--path)')
  
  g.append('g')
    .attr('id', 'links')
  g.append('g')
    .attr('id', 'nodes')

  const createdNodes = plot.select('#nodes')

  applySimulation()

  render({ nodes, links }, target, root)
  return render

  function render({ nodes, links }, target, root) {
    // making default node static
    const rootObj = nodes.find(d => d.name === root)
    rootObj.fx = 0
    rootObj.fy = height / 2

    applySimulation(nodes, links, root, target)
    const nodesContainer = createdNodes
      .selectAll('g')
      .data(nodes, d => `${d.name}@${d.version}`)
      .join('g')
      .attr('class', 'node')

    nodesContainer
      .append('text')
      .text(d => d.name)
      .attr('x', 30)
      .attr('y', 5)
      .style('pointer-events', 'none')
      .style('font-family', 'Arimo')
      .style('font-size', '24px')
      .attr('fill', '#9d9d9d')

    nodesContainer
      .insert('circle', 'text')
      .attr('r', 20)
      .style('stroke', '#63a3ee')
      .style('stroke-width', '1')
      .style('rx', '10')
      .style('ry', '10')
      .style('box-shadow', '5px 10px')
      .attr('fill', d => {
        if(d.name === target) {
          return '#cefad0'
        }
        if(d.name === root) {
          return '#ffcccb'
        }
  
        return '#5ca9f8'
      })
      .style('cursor', 'pointer')
      .on('mouseenter', function (e, d) {
        showDetails(e, d)
      })
      .on('mouseleave', function() {
        closeDetails()
      })
  }

  function applySimulation(nodes, links, root, target) {
    simulation && simulation.stop()

    simulation = d3.forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(0))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("link", d3.forceLink(links).distance(d => {
        if(d.source.name === root || d.target.name === target) {
          return 200
        }

        return 100
      }).id((d, i) => i))
      .force("x", d3.forceX().strength(1).x(d => {
        if (d.name === root) {
          return width
        }
        if (links.length > 10 && d.name === target) {
          return width * 2
        }
        return width / 2
      }))
      .force("y", d3.forceY().strength(0))
      .force('collide', d3.forceCollide(d => 80))
      .on('tick', () => {
        updateLinks(links)
        updateNodes(nodes)
      })
  }

  function updateLinks(links) {
    plot.select('#links')
      .selectAll('polyline')
      .data(links)
      .join('polyline')
      .attr('points', d => `${d.source.x},${d.source.y} ${(d.source.x + d.target.x) / 2},${(d.source.y + d.target.y) / 2} ${d.target.x},${d.target.y}`)
      .style('stroke', 'var(--path)')
      .style('stroke-width', 2)
      .attr('marker-mid', 'url(#arrow)')
  }
  
  function updateNodes(nodes) {
    plot.select('#nodes')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('transform', d => `translate(${d.x} ${d.y})`)      
  }

  function closeDetails() {
    window.dispatchEvent(
      new CustomEvent('popups-remove', {
        detail: 'module-data-popup'
      })
    )
  }

  function zoomed({ transform }) {
    closeDetails()
    plot.select('#plot-content').attr('transform', transform)
  }

  function showDetails(event, obj) {
    const shift = 10 
    const {x, y, width, height} = event.target.getBoundingClientRect()
    const details = obj
    window.dispatchEvent(
      new CustomEvent('popups-add', {
        detail: {
          popup: 'module-data-popup',
          options: {
            __data__: details,
            x: x + width - shift,
            y: y + height - shift
          }
        }
      })
    )
  }
}

export default dependenciesNetworkPlot
