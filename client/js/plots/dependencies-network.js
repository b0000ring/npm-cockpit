let plot = null
let simulation = null

let height = null 
let width = null 


// add opacity except the path to selected node on click
function dependenciesNetworkPlot({ nodes, links }, svg, target, root) {
  if(!nodes || !links) {
    plot?.select('#plot-content').selectAll('*').remove()
    return 
  }

  // making default node static
  const rootObj = nodes.find(d => d.name === root)
  rootObj.fx = 0
  rootObj.fy = height / 2
  
  if(!plot) {
    plot = d3.select(svg)
      .attr('width', '100%')
      .attr('height', '100%')

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
      .call(zoom.transform, d3.zoomIdentity.translate(40, height / 2).scale(0.4))
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
      .style('stroke', '#e0e4e7')
      .style('fill', '#e0e4e7')
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
    .attr('x', 30)
    .attr('y', 5)
    .style('pointer-events', 'none')
    .style('font-family', 'Roboto')
    .style('font-size', '24px')
    .attr('fill', '#9d9d9d')

  createdNodes
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

  simulation?.stop()

  simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("link", d3.forceLink(links).distance(100).id((d, i) => i))
    .force("x", d3.forceX().strength(1).x(d => {
      if (d.name === root) {
        return width;
      }
      return width / 2;
    }))
    .force("y", d3.forceY().strength(0))
    .force('collide', d3.forceCollide(d => 80))
    .on('tick', () => {
      updateLinks()
      updateNodes()
    })


  function updateLinks() {
    d3.select('#links')
      .selectAll('polyline')
      .data(links)
      .join('polyline')
      .attr('points', d => `${d.source.x},${d.source.y} ${(d.source.x + d.target.x) / 2},${(d.source.y + d.target.y) / 2} ${d.target.x},${d.target.y}`)
      .style('stroke', '#e0e4e7')
      .attr('marker-mid', 'url(#arrow)')
  }
  
  function updateNodes() {
    d3.select('#nodes')
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
