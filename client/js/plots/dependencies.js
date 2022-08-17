import { Popups } from '../components/popups.js'

export default function dependencies(data, svg) {
  const nodeHeight = 100
  const nodeWidth = 200
  const nodeSeparation = 30
  const height = parseInt(svg.style('height'))
  const width = parseInt(svg.style('width'))
  
  const nodes = d3.hierarchy(data, d => d.dependencies)
  const lnkMkr = d3.linkHorizontal().x(d => d.x).y(d => d.y)

  const colorScale = d3.scaleSequential()
    .domain([0, nodes.height])
    .interpolator(d3.interpolateRainbow);

  const g = svg.append('g')
    .attr('id', 'plot')

  const zoom = d3.zoom()
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed)

  svg.on('click', function(e) {
    // actions only on svg element click
    if(e.target.nodeName === 'svg') {
      closeDetails()
    } 
  })

  // applying zoon
  svg
    // setting default zoom values
    .call(zoom.transform, d3.zoomIdentity.translate(350,100).scale(0.5))
    .call(zoom)

  svg.append('defs')
    .append('rect')
    .attr('id', 'node')
    .attr('width', nodeWidth)
    .attr('height', nodeHeight)
    .style('stroke', 'black')
    .style('stroke-width', '1')
    .style('rx', '10')
    .style('ry', '10')
    .style('box-shadow', '5px 10px')
  
  d3.tree().nodeSize([nodeWidth + nodeSeparation, nodeHeight + nodeSeparation])( nodes )

  g.selectAll( "path" ).data( nodes.links() ).enter()
    .append( "path" ).attr( "d", d => lnkMkr(d) )
    .attr( "stroke", "black" ).attr( "fill", "none" )
      
  const selection = g.selectAll("g").data( nodes.descendants() ).enter()
  renderItem(selection)

  function closeDetails() {
    Popups.removePopup('module-data-popup')
  }

  function renderItem(selection) {
    const g = selection.append('g')
      .style('cursor', 'pointer')
      .attr('text-anchor', 'start')
      .on('click', showDetails)
      .on('mouseenter', function (e, d) {
        showDetails(e, d)
        d3.select(this).select('use')
          .attr('opacity', 0.9)
      })
      .on('mouseleave', function(e, d) {
        closeDetails()
        d3.select(this).select('use')
          .attr('opacity', 1)
      })

    g.append('use')
      .attr('href', '#node')
      .attr('stroke-width', 2)
      .attr('x', d => d.x - 25).attr('y', d => d.y - 25)
      .attr('fill', d => colorScale(d.depth))

    g.append('text')
      .attr('x', d => d.x - 5)
      .attr('y', d => d.y + 25)
      .attr('fill', 'white')
      .text(d => d.data.version)
      
    g.append('text')
      .attr('x', d => d.x - 5)
      .attr('y', d => d.y)
      .text(d => d.data.name)
  }

  function showDetails(event, obj) {
    const [x, y] = d3.pointer(event, document.body)
    const details = obj.data

    Popups.addPopup({
      popup: 'module-data-popup',
      options: {
        __data__: details,
        x: x,
        y: y
      }
    });
  }

  function zoomed({ transform }) {
    g.attr("transform", transform)
  }
}