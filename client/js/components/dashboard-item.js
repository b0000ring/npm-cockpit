export class DashboardItem extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title')
    const component = this.getAttribute('component')
    const item = document.createElement(component)
    const titleElement = document.createElement('h2')

    titleElement.innerText = title

    this.appendChild(titleElement)
    this.appendChild(item)
  }
}