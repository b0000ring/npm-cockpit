export default function dependencies(data, svg) {
  const nodeHeight = 50
  const nodeWidth = 120
  const nodeSeparation = 30
  const height = parseInt(svg.style('height'))
  const width = parseInt(svg.style('width'))
  

  console.log(data)
  const nodes = d3.hierarchy(data, d => d.dependencies)
  const lnkMkr = d3.linkHorizontal().x( d => d.y ).y( d => d.x )

  const colorScale = d3.scaleSequential()
    .domain([0, nodes.height])
    .interpolator(d3.interpolateRainbow);

  const g = svg.append('g')
    .attr('id', 'plot')

  const zoom = d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([0.5, 2])
    .on("zoom", zoomed)

  svg.on('click', function(e) {
    // actions only on svg element click
    if(e.target.nodeName === 'svg') {
      closeDetails()
    } 
  })

  svg
    .call(zoom.transform, d3.zoomIdentity.translate(80, 250))
    .call(zoom)

  svg.append('defs')
    .append('rect')
    .attr('id', 'node')
    .attr('width', nodeWidth)
    .attr('height', nodeHeight)
    // .style('fill', 'white')
    .style('stroke', 'black')
    .style('stroke-width', '1')
    .style('rx', '10')
    .style('ry', '10')
    .style('box-shadow', '5px 10px')
  
  d3.tree().nodeSize([nodeHeight + nodeSeparation, nodeWidth + nodeSeparation])( nodes )

  g.selectAll( "path" ).data( nodes.links() ).enter()
    .append( "path" ).attr( "d", d => lnkMkr(d) )
    .attr( "stroke", "black" ).attr( "fill", "none" )
      
  const selection = g.selectAll("g").data( nodes.descendants() ).enter()
  renderItem(selection)

  function closeDetails() {
    svg.select('#details').remove()
  }

  function renderItem(selection) {
    const g = selection.append('g')
      .attr('text-anchor', 'middle')
      .on('click', showDetails)
      .on('mouseenter', function () {
        d3.select(this).select('use')
          .attr('stroke-width', 1)
      })
      .on('mouseleave', function(e, d) {
        d3.select(this).select('use')
          .attr('stroke-width', 2)
      })

    g.append('use')
      .attr('href', '#node')
      .attr('stroke-width', 2)
      .attr('x', d => d.y - 60 ).attr('y', d => d.x - 25 )
      .attr('fill', d => colorScale(d.depth))

    g.append('text')
      .attr('x', d => d.y)
      .attr('y', d => d.x + 15)
      .attr('fill', 'white')
      .text(d => d.data.version)
      
    g.append('text')
      .attr('x', d => d.y)
      .attr('y', d => d.x - 5)
      .text(d => d.data.name)
  }

  function showDetails(event, obj) {
    svg.select('#details').remove()

    const [x, y] = d3.pointer(event)

    const container = svg.select('#plot').append('foreignObject')
      .attr('id', 'details')
      .attr('x', x)
      .attr('y', y)
      .attr('width', '400px')
      .attr('height', '600px')
    const details = obj.data

    const modal = container.append('xhtml:div')
      .attr('xmlns', 'http://www.w3.org/1999/xhtml')
      .attr('class', 'modal-content')
      .attr('style', `width: 400px; background: white; position: fixed;`)
      .html(null)
  
    const header = modal.append('div')
      .attr('class', 'modal-header')
      .html(details.name)

    header.append('a')
      .attr('href', `https://www.npmjs.com/package/${details.name}/`)
      .attr('target', '_blank')
      .text('NPM')

    const body = modal.append('div')
      .attr ('class', 'modal-body')
      .append('table')
      .attr('class', 'table table-bordered')
      .append('tbody')

    Object.keys(details).forEach((key) => {
      const content = details[key]
      if(key === 'dependencies' || key === 'name'  || !content) {
        return
      }
      const row = body.append('tr')

      row.append('th')
          .attr('scope', 'row')
          .text(key)
  
      const target = row.append('td')

      if(key === 'homepage') {
        target.append('a')
          .attr('href', content)
          .attr('target', '_blank')
          .text(content)
        return
      }

      if(Array.isArray(content)) {
        content.forEach(item => {
          target.append('div')
            .text(item)
            .append('hr')
        })
      } else {
        target.text(content)
      }
    })
  }

  function zoomed({ transform }) {
    g.attr("transform", transform)
  }
}