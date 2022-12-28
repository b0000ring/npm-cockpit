export class VersionItem extends HTMLElement {

  data = {}

  renderVersion() {
    const info = document.createElement('dependency-info')
    info.__data__ = this.data

    const component = document.createElement('dependency-version')
    component.version = this.data.version
    component.isHighest = true

    info.append(component)

    return info
  }

  renderName() {
    const name = document.createElement('div')
    name.className = 'version-item_name'
    name.textContent = this.data.name
    
    return name
  }

  render() {
    this.data = this.__data__
    this.append(this.renderName(), this.renderVersion())
  }

  connectedCallback() {
    this.render()
  }

}