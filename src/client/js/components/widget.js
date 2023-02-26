export class Widget extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name')
    const component = this.getAttribute('component')
    const item = document.createElement(component)
    const titleElement = document.createElement('h2')
    titleElement.innerText = name

    this.appendChild(titleElement)
    this.appendChild(item)
  }
}