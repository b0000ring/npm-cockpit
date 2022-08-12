export class Loading extends HTMLElement {
  connectedCallback() {
    const svg = document.createElement('object')
    svg.setAttribute('type', 'image/svg+xml')
    svg.setAttribute('data', '/static/loading.svg')
    svg.setAttribute('width', '100')
    svg.setAttribute('height', '100')
    this.appendChild(svg)
  }
}