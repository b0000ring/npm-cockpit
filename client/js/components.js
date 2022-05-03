class Page extends HTMLElement {
  data = null
  
  constructor() {
    super() 

    this.wrapper = document.createElement('div')
    this.wrapper.innerHTML = '<link href="css/bootstrap.min.css" rel="stylesheet">'

    this.attachShadow({mode: 'open'})
    this.shadowRoot.append(this.wrapper)
  }

  async getData(source) {
    this.data = await d3.json(source)
  }
}

class Dependencies extends Page {
  current = null

  set selectedItem(data) {
    this.current = data
    this.updatePlot()
    this.showDetails()
  }

  get selectedItem() {
    return this.current
  }

  constructor() {
    super()

    d3.select(this.wrapper)
      .attr('style', 'position: relative;')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '640px')

    d3.select(this.wrapper).append('div')
      .attr('id', 'details')

    this.getData('/api/dependencies').then(this.renderPlot.bind(this))
  }

  closeDetails() {
    const container = d3.select(this.wrapper).select('#details')
    container.html(null)
    this.selectedItem = null
  }

  showDetails() {
    //TODO  coords/width/height should be calculated to avoid oversize/incorrect positioning 
    // (should be always visible)
   
    const container = d3.select(this.wrapper).select('#details')
    const details = this.selectedItem?.data.data
    container.html(null)

    if(!details) {
      return
    }

    const coords = d3.pointer(this.selectedItem?.event, this.wrapper)
    const x = coords[1]
    const y = coords[0] + 50

    const modal = container.append('div')
      .attr('class', 'modal-content')
      .attr('style', `position: absolute; display: block; top: ${x}; left: ${y}; width: 400px; background: white;`)
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

  renderItem(selection) {
    const g = selection.append('g')
      .attr('text-anchor', 'middle')
      .on('click', (e, d) => {
        this.selectedItem = {
          data: d,
          event: e
        }
      })
      .on('mouseenter', function (){
        d3.select(this).select('use')
          .attr('stroke-width', 1)
      })
      .on('mouseleave', (() => {
        // try to refactor and avoid using self
        const self = this;
        return function(e, d) {
          d3.select(this).select('use')
            .attr('stroke-width', d === self.selectedItem?.data ? 1 : 2)
        }
      })())

    g.append('use')
      .attr('href', '#node')
      .attr('stroke-width', 2)
      .attr('x', d => d.y - 60 ).attr('y', d => d.x - 25 )

    g.append('text')
      .attr('x', d => d.y)
      .attr('y', d => d.x + 15)
      .attr('fill', 'grey')
      .text(d => d.data.version)
      
    g.append('text')
      .attr('x', d => d.y)
      .attr('y', d => d.x - 5)
      .text(d => d.data.name)

  }

  updatePlot() {
    d3.select(this.wrapper).selectAll('use')
      .attr('stroke-width', d => d === this.selectedItem?.data ? 1 : 2)
  }

  renderPlot() {
    const svg = d3.select(this.wrapper).select('svg')
      .attr('cursor', 'pointer')
    const nodeHeight = 50
    const nodeWidth = 120
    const nodeSeparation = 30
    const height = parseInt(svg.style('height'))
    const width = parseInt(svg.style('width'))
    const nodes = d3.hierarchy(this.data, d => d.dependencies)
    const lnkMkr = d3.linkHorizontal().x( d => d.y ).y( d => d.x )

    const g = svg.append('g')
      .attr('id', 'plot')

    const zoomed = () => {
      const self = this
      return function({ transform }) {
        self.closeDetails()
        g.attr("transform", transform)
      }
    }

    const zoom = d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.5, 2])
      .on("zoom", zoomed())

    svg
      .call(zoom.transform, d3.zoomIdentity.translate(80, 250))
      .call(zoom)

    svg.append('defs')
      .append('rect')
      .attr('id', 'node')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .attr('rx', '20')
      .attr('ry', '20')
    
    d3.tree().nodeSize([nodeHeight + nodeSeparation, nodeWidth + nodeSeparation])( nodes )

    g.selectAll( "path" ).data( nodes.links() ).enter()
            .append( "path" ).attr( "d", d => lnkMkr(d) )
            .attr( "stroke", "black" ).attr( "fill", "none" )
        
    const selection = g.selectAll("g").data( nodes.descendants() ).enter()
    this.renderItem(selection)
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
  }
}

class Statistic extends Page {
  // show statistic of dependencies
  // by frequency
  // updates status (updated, has minor updates, has major updates)
  // 
  constructor() {
    super()

    this.wrapper.innerHTML = 'statistic'

    // how common are particular dependency is
    d3.select(this.wrapper)
      .append('svg')
      .attr('id', 'frequency')

    d3.select(this.wrapper)
      .append('svg')
      .attr('id', 'updates')

    this.getData('/api/statistic').then(() => console.log(this.data))
  }
}

class About extends Page {
  // show info about this app
  constructor() {
    super()

    this.wrapper.innerHTML = 'about'
  }
}

window.customElements.define('dependencies-component', Dependencies)
window.customElements.define('security-component', Security)
window.customElements.define('statistic-component', Statistic)
window.customElements.define('about-component', About)