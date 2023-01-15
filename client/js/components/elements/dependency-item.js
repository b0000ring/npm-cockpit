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
    const updatable = this.updatable
    const vulnerable = this.vulnerable

    if(!updatable && !vulnerable) return ''

    const container = document.createElement('div')
    container.className = 'dependency-item_indicators'

    if(updatable) {
      const updateIndicator = document.createElement('div')
      updateIndicator.className = 'dependency-item_indicators_update'
      updateIndicator.textContent = 'U'
      updateIndicator.title = 'Update available'
      container.append(updateIndicator)
    }

    if(vulnerable) {
      const vulerableIndicator = document.createElement('div')
      vulerableIndicator.className = 'dependency-item_indicators_vulnerable'
      vulerableIndicator.textContent = 'V'
      vulerableIndicator.title = 'Vulnerability found'
      container.append(vulerableIndicator)
    }

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