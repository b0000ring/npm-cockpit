export class Icon extends HTMLElement {
  connectedCallback() {
    const { data, width, height } = this
    const svg = document.createElement('object')
    svg.setAttribute('type', 'image/svg+xml')
    svg.setAttribute('data', data)
    svg.setAttribute('width', width)
    svg.setAttribute('height', height)
    this.appendChild(svg)
  }
}