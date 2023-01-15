export class DependencyVersion extends HTMLElement {
  connectedCallback() {
    const version = this.version
        
    this.textContent = version
  }
}