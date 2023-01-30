import Item from './Item.js'
import { makeRequest } from '../../utils.js'

export class BasicInfo extends Item {
  updates = 0
  vulnerabilities = 0
  nodes = 0
  deprecated = 0
  directDependencies = 0
  directUpdates = 0
  directVulns = 0
  directDeprecated = 0

  constructor() {
    super('/api/dependencies')
  }

  async processData() {
    super.loading = true

    const vulnerabilitiesData = await makeRequest('/api/vulnerabilities')
    const updates = await makeRequest('/api/updates')
    const deprecated = await makeRequest('/api/deprecated')
    const { vulnerabilities } = vulnerabilitiesData
    const vulnLibs = Object.keys(vulnerabilities)
    const updatesLibs = Object.keys(updates)
    const deprecatedLibs = Object.keys(deprecated)

    this.nodes = Object.keys(this.data.dependencies).length
    this.updates = updatesLibs.length
    this.vulnerabilities = vulnLibs.length
    this.deprecated = deprecatedLibs.length

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
    if(!this.data || this.loading) return false

    const totalDeps = this.createSection('Dependencies total / direct', this.nodes, this.directDependencies)
    totalDeps.className += ' basic-info_section_without_indicator'

    const updates = this.createSection('Updates total / direct', this.updates, this.directUpdates, '/static/update-icon.svg', 'updates-list')
    const vuln = this.createSection('Vulnerabilities total / direct', this.vulnerabilities, this.directVulns, '/static/vuln-icon.svg', 'vulnerabilities-list')
    const totalDep = this.createSection('Deprecated', this.deprecated, this.directDeprecated, '/static/dep-icon.svg', 'deprecated-list')
    
    this.append(totalDeps, updates, vuln, totalDep)
  }

}