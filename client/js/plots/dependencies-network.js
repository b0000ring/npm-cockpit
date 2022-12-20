let plot = null

function dependenciesNetworkPlot({ nodes, links }, svg) {
  if(!nodes || !links) {
    plot?.select('#plot-content').selectAll('*').remove()
    return 
  }

  const nodeSeparation = 100

  let height = null 
  let width = null 

  if(!plot) {
    plot = d3.select(svg)
      .attr('width', '100%')
      .attr('height', '100%')
      .style('background', '#37334D')

    height = parseInt(plot.style('height'))
    width = parseInt(plot.style('width'))

    const zoom = d3.zoom()
      .extent([[0, 0], [width, height]])
      .on('zoom', zoomed)
    
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

  g.append('g')
    .attr('id', 'links')

  g.append('g')
    .attr('id', 'nodes')

  const createdNodes = d3.select('#nodes')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .attr('class', 'node')

  createdNodes
    .append('text')
    .text(d => d.name)
    .attr('x', 12)
    .attr('y', '20')
    .style('pointer-events', 'none')

  createdNodes
    .insert('rect', 'text')
    .attr('width', (d, i) => {
      const nodes = createdNodes.nodes()
      const node = nodes[i]
      const width = node.getBoundingClientRect().width
      return width * 2 + 24
    })
    .attr('height', 32)
    .attr('rx', 24)
    .attr('fill', 'white')
    .attr('stroke-width', '1')
    .attr('stroke', '#8CBAFF')
    .style('cursor', 'pointer')
    .on('mouseenter', function (e, d) {
      showDetails(e, d)
    })
    .on('mouseleave', function() {
      closeDetails()
    })

  d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('link', d3.forceLink().links(links).distance(nodeSeparation))
    .force('collide', d3.forceCollide().radius(100))
    .on('tick', () => {
      updateLinks()
      updateNodes()
    })

  function updateLinks() {
    d3.select('#links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('x1', function(d) {
        return d.source.x
      })
      .attr('y1', function(d) {
        return d.source.y
      })
      .attr('x2', function(d) {
        return d.target.x
      })
      .attr('y2', function(d) {
        return d.target.y
      })
      .style('stroke', '#8CBAFF')
  }
  
  function updateNodes() {
    d3.select('#nodes')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('transform', d => `translate(${d.x - 10} ${d.y - 10})`)      
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
    const details = obj.data
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
