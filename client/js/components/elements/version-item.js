export class VersionItem extends HTMLElement {

  data = {}

  renderVersion() {
    const component = document.createElement('dependency-version')
    component.version = this.data.version
    component.isHighest = true

    return component
  }

  renderName() {
    const name = document.createElement('div')
    name.className = 'version-item_name'
    name.textContent = this.data.name
    
    return name
  }

  renderInfo() {
    const info = document.createElement('dependency-info')
    info.__data__ = this.data

    return info
  }

  render() {
    this.data = this.__data__
    this.append(this.renderName(), this.renderInfo(), this.renderVersion())
  }

  connectedCallback() {
    this.render()
  }

}