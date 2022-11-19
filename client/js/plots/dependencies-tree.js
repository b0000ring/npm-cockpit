import { wrapText } from './utils.js'

let plot = null

// TODO refactor
export default function dependencies(data, svg, setPath) {
  if(!data) {
    plot.select('#plot-content').selectAll('*').remove()
    return 
  }
  const nodeHeight = 44
  const nodeWidth = 100
  const nodeSeparation = 30

  const nodes = d3.hierarchy(data, d => d.deps)
  const lnkMkr = d3.linkHorizontal().x(d => d.x).y(d => d.y)
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
      .append('rect')
      .attr('id', 'node')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .style('stroke', 'black')
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

  const colorScale = d3.scaleLinear()
    .domain([0, 10])
    .range(['#2EBCDB', '#93E2F2'])
    .interpolate(d3.interpolateHcl)

  const g = plot.select('#plot-content')

  g.selectAll('*').remove()

  d3.tree().nodeSize([nodeWidth + nodeSeparation, nodeHeight + nodeSeparation])(nodes)

  g.selectAll('path').data(nodes.links()).enter()
    .append('path').attr('d', d => lnkMkr(d))
    .attr('stroke', 'black').attr('fill', 'none')
      
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

    g.append('use')
      .attr('href', '#node')
      .attr('stroke-width', 2)
      .attr('x', d => d.x - 25).attr('y', d => d.y - 25)
      .attr('fill', d => d.data.error ? '#F73E6C' : colorScale(d.depth))

    g.append('text')
      .attr('x', d => d.x - 15)
      .attr('y', d => d.y + 5)
      .attr('fill', 'white')
      .style('font-family', 'Roboto')
      .style('font-size', '10px')
      .text(d => d.data.error ? wrapText(d.data.description, 15) : d.data.version)
      
    g.append('text')
      .attr('x', d => d.x - 15)
      .attr('y', d => d.y - 10)
      .text(d => wrapText(d.data.name))
      .style('font-family', 'Roboto')
      .style('font-size', '8px')
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

  function zoomed({ transform }) {
    closeDetails()
    plot.select('#plot-content').attr('transform', transform)
  }
}

