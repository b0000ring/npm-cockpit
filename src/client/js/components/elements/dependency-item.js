export class DependencyItem extends HTMLElement {

  renderVersions(versions) {
    const container = document.createElement('div')
    container.className = 'dependency-item_versions-tags'

    const items = versions.map((data) => {
      const info = document.createElement('dependency-info')
      info.__data__ = data

      const component = document.createElement('dependency-version')
      component.version = data.version

      info.append(component)

      return info
    })

    container.append(...items)

    return container
  }

  renderName(value) {
    const container = document.createElement('div')
    container.className = 'dependency-item_name-container'
    
    const name = document.createElement('div')
    name.className = 'dependency-item_name'
    name.textContent = value

    container.append(name)

    return container
  }

  renderIndicators() {
    const { name } = this.__data__
    const container = document.createElement('div')
    container.className = 'dependency-item_indicators'

    const updatable = this.updatable
    const vulnerable = this.vulnerable
    const deprecated = this.deprecated

    // refactor
    if(updatable) {
      const updateIndicator = document.createElement('img')
      updateIndicator['data-target'] = 'updates-list'
      updateIndicator['data-dependency'] = name
      updateIndicator.title = 'Update available'
      updateIndicator.src = '/static/update-icon.svg'
      updateIndicator.className = 'indicator'
      container.append(updateIndicator)
    }

    if(vulnerable) {
      const vulerableIndicator = document.createElement('img')
      vulerableIndicator['data-target'] = 'vulnerabilities-list'
      vulerableIndicator['data-dependency'] = name
      vulerableIndicator.title = 'Vulnerability found'
      vulerableIndicator.src = '/static/vuln-icon.svg'
      vulerableIndicator.className = 'indicator'
      container.append(vulerableIndicator)
    }

    if(deprecated) {
      const deprecatedIndicator = document.createElement('img')
      deprecatedIndicator['data-target'] = 'deprecated-list'
      deprecatedIndicator['data-dependency'] = name
      deprecatedIndicator.title = 'Deprecated'
      deprecatedIndicator.src = '/static/dep-icon.svg'
      deprecatedIndicator.className = 'indicator'
      container.append(deprecatedIndicator)
    }

    const treeIcon = document.createElement('img')
    treeIcon['data-target'] = 'dependencies-tree'
    treeIcon['data-dependency'] = name
    treeIcon.title = 'Show in tree'
    treeIcon.src = '/static/tree-icon.svg'
    treeIcon.className = 'indicator button'
    container.append(treeIcon)

    const netIcon = document.createElement('img')
    netIcon['data-target'] = 'dependencies-network'
    netIcon['data-dependency'] = name
    netIcon.title = 'Show in network'
    netIcon.src = '/static/net-icon.svg'
    netIcon.className = 'indicator button'
    container.append(netIcon)

    return container
  }

  render() {
    //TODO change to normal re-render
    this.textContent = ''

    const {name, versions} = this.__data__
    const container = document.createElement('div')
    container.className = 'dependency-item_data'

    const header = document.createElement('div')
    header.className = 'dependency-item_header'

    const description = document.createElement('div')
    description.className = 'dependency-item_description'
    description.textContent = versions[0].description

    header.append(this.renderName(name, versions[0]), this.renderIndicators())
    container.append(header, description, this.renderVersions(versions))

    this.append(container)
  }

  connectedCallback() {
    this.render()
  }
}