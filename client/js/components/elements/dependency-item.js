export class DependencyItem extends HTMLElement {

  isVersionsListOpen = false

  static get observedAttributes() { return ['updatable', 'vulnerable']; }

  attributeChangedCallback() {
    this.render()
  }

  toggleVersionsList = () => {
    this.isVersionsListOpen = !this.isVersionsListOpen
    this.render()
  }

  renderVersionsList(versions) {
    if(versions.length === 1) return ''

    const container = document.createElement('div')
    container.className = 'dependency-item_versions-list'

    const trigger = document.createElement('div')
    trigger.className = 'dependency-item_versions-list_trigger'
    trigger.addEventListener('click', this.toggleVersionsList)

    const arrow = document.createElement('span')
    arrow.className = 'dependency-item_versions-list_trigger_icon'
    arrow.textContent = '►'

    trigger.append(arrow, 'Versions')

    container.append(trigger)

    if(this.isVersionsListOpen) {
      container.className += ' dependency-item_versions-list-opened'
      const listWrapper = document.createElement('div')
      listWrapper.className = 'dependency-item_versions-list-wrapper'
      const list = versions.map(version => {
        const item = document.createElement('version-item')
        item.__data__ = version

        return item
      })

      listWrapper.append(...list)
      container.append(listWrapper)
    }

    return container
  }

  renderVersions(versions) {
    const container = document.createElement('div')
    container.className = 'dependency-item_versions-tags'

    const items = versions.map((data, i) => {
      const component = document.createElement('dependency-version')
      component.version = data.version
      component.isHighest = i === 0

      return component
    })

    container.append(...items)

    return container
  }

  renderName(value, data) {
    const container = document.createElement('div')
    container.className = 'dependency-item_name-container'
    
    const name = document.createElement('div')
    name.className = 'dependency-item_name'
    name.textContent = value

    const info = document.createElement('dependency-info')
    info.__data__ = data

    container.append(name, info)

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

    header.append(this.renderName(name, versions[0]), this.renderIndicators())
    container.append(header, this.renderVersions(versions))

    this.append(container, this.renderVersionsList(versions))
  }

  connectedCallback() {
    const {name} = this.__data__

    this.setAttribute('data-dependency-name', name)
    this.render()
  }
}