export class DependencyVersion extends HTMLElement {
  connectedCallback() {
    const version = this.version
    const isHighest = this.isHighest
       
    if(isHighest) {
      this.className += 'version-tag-highest'
    }
    this.textContent = version
  }
}