import Item from './Item.js'
import { makeRequest } from '../../utils.js'

export class BasicInfo extends Item {
  updates = null
  vulnerabilities = null
  nodes = null
  deprecated = null
  directDependencies = 0
  directUpdates = 0
  directVulns = 0
  directDeprecated = 0

  constructor() {
    super('/api/dependencies')
  }

  async processData() {
    this.loading = true 
    
    let vulnLibs = []
    let updatesLibs = []
    let deprecatedLibs = []

    const [vulnerabilities, updates, deprecated] = await Promise.allSettled(
      [
        makeRequest('/api/vulnerabilities'),
        makeRequest('/api/updates'),
        makeRequest('/api/deprecated')
      ]
    ).then((values) => values.map(item => item.value))

    // if(vulnerabilities.error || updates.error || deprecated.error) {
    //   this.error = true
    //   this.loading = false
    //   this.render()
    //   return
    // }

    if(!vulnerabilities.error) {
      const { vulnerabilities: vulnerabilitiesItems } = vulnerabilities
      vulnLibs = Object.keys(vulnerabilitiesItems)
      this.vulnerabilities = vulnLibs.length
    }

    if(!updates.error) {
      updatesLibs = Object.keys(updates)
      this.updates = updatesLibs.length
    }

    if(!deprecated.error) {
      deprecatedLibs = Object.keys(deprecated)
      this.deprecated = deprecatedLibs.length
    }
     
    this.nodes = Object.keys(this.data.dependencies).length
    const root = this.data.dependencies[this.data.root][0]
    this.directDependencies = root.connections.length

    root.connections.forEach(item => {
      if(updatesLibs.includes(item.name)) {
        this.directUpdates += 1
      }
      if(vulnLibs.includes(item.name)) {
        this.directVulns += 1
      }
      if(deprecatedLibs.includes(item.name)) {
        this.directDeprecated += 1
      }
    })

    this.loading = false
    this.render()
  }

  createSection(title, total, direct, indicator, target) {
    // if data was not loaded hide the section
    if(total === null) {
      return ''
    }

    const container = document.createElement('div')
    container.className = 'basic-info_section'

    const dataContainer = document.createElement('div')

    const titleContainer = document.createElement('div')
    titleContainer.className = 'basic-info_section_title'
    titleContainer.textContent = title

    const totalContainer = document.createElement('span')
    totalContainer.textContent = total

    const directContainer = document.createElement('span')
    directContainer.textContent = direct

    if(direct > 0) {
      directContainer.className += ' warning'
    } else {
      directContainer.className += ' good'
    }

    dataContainer.append(titleContainer, totalContainer, ' / ' , directContainer)
    container.append(dataContainer)

    if(total > 0 && indicator) {
      const indicatorElement = document.createElement('img')
      indicatorElement.src = indicator
      indicatorElement.className = 'indicator'
      indicatorElement.addEventListener('click', () => {
        window.dispatchEvent(
          new CustomEvent(`dashboard-scroll`, {detail: target})
        )
      })
      container.append(indicatorElement)
    }

    return container
  }

  render() {
    if(!this.data || super.loading || super.error) return

    const totalDeps = this.createSection('Dependencies total / direct', this.nodes, this.directDependencies)
    totalDeps.className += ' basic-info_section_without_indicator'

    const updates = this.createSection('Updates total / direct', this.updates, this.directUpdates, '/static/update-icon.svg', 'updates-list')
    const vuln = this.createSection('Vulnerabilities total / direct', this.vulnerabilities, this.directVulns, '/static/vuln-icon.svg', 'vulnerabilities-list')
    const totalDep = this.createSection('Deprecated', this.deprecated, this.directDeprecated, '/static/dep-icon.svg', 'deprecated-list')
    
    this.append(totalDeps, updates, vuln, totalDep)
  }

}