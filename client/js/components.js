class Page extends HTMLElement {
  data = null
  
  constructor() {
    super() 

    this.wrapper = document.createElement('div')
  }

  async getData(source) {
    this.data = await d3.json(source)
  }
}

class Dependencies extends Page {
  // show tree of dependencies (scrollable)
  // click on dependency show popup with info
  constructor() {
    super()

    d3.select(this.wrapper).append('svg')
      .attr('width', '100%')
      .attr('height', '640px')

    this.getData('/api/dependencies').then(this.renderPlot.bind(this))

    this.attachShadow({mode: 'open'})
    this.shadowRoot.append(this.wrapper)
  }

  renderItem(selection) {
    const g = selection.append('g')
      .attr('text-anchor', 'middle')

    g.append('rect')
      .attr('width', '120')
      .attr('height', '50')
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .attr('x', d => d.y - 60 ).attr('y', d => d.x - 25 )
    
    g.append('text')
      .attr('x', d => d.y)
      .attr('y', d => d.x)
      .text(d => d.data.name)
  }

  renderPlot() {
    const svg = d3.select(this.wrapper).select('svg')
      .attr('cursor', 'pointer')
      
    const height = parseInt(svg.style('height'))
    const width = parseInt(svg.style('width'))
    const nodes = d3.hierarchy(this.data, d => d.dependencies)
    const lnkMkr = d3.linkHorizontal().x( d => d.y ).y( d => d.x )

    const g = svg.append('g')
      .attr('id', 'plot')

    const zoom = d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([0.5, 2])
    .on("zoom", zoomed)

    svg
      .call(zoom.transform, d3.zoomIdentity.translate(25, 25))
      .call(zoom)
    
    
    d3.tree().size( [height, width] )( nodes );  

    g.selectAll( "path" ).data( nodes.links() ).enter()
            .append( "path" ).attr( "d", d => lnkMkr(d) )
            .attr( "stroke", "black" ).attr( "fill", "none" )
        
    g.selectAll("rect").data( nodes.descendants() ).enter()
        .call(this.renderItem)

    function zoomed({ transform }) {
      g.attr("transform", transform)
    }
  }
}

class Security extends Page {
  // show table with security issues for dependencies
  // user can click update button to install latest version
  // show warning if this is major version
  constructor() {
    super()

    this.wrapper.innerHTML = 'security'

    this.getData('/api/security').then(() => console.log(this.data))

    this.attachShadow({mode: 'open'})
    this.shadowRoot.append(this.wrapper)
  }
}

class Statistic extends Page {
  // show statistic of dependencies usage
  // most frequent, biggest by size, etc
  constructor() {
    super()

    this.wrapper.innerHTML = 'statistic'

    this.getData('/api/statistic').then(() => console.log(this.data))

    this.attachShadow({mode: 'open'})
    this.shadowRoot.append(this.wrapper)
  }
}

class About extends Page {
  // show info about this app
  constructor() {
    super()

    this.wrapper.innerHTML = 'about'

    this.attachShadow({mode: 'open'})
    this.shadowRoot.append(this.wrapper)
  }
}

window.customElements.define('dependencies-component', Dependencies)
window.customElements.define('security-component', Security)
window.customElements.define('statistic-component', Statistic)
window.customElements.define('about-component', About)