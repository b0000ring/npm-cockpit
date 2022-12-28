export class DependencyInfo extends HTMLElement {
  connectedCallback() {
    const data = this.__data__

    this.textContent = 'i'
    this.addEventListener('mouseenter', function(e) {
      const shift = 10 
      const {x, y, width, height} = e.target.getBoundingClientRect()
      window.dispatchEvent(
        new CustomEvent('popups-add', {
          detail: {
            popup: 'module-data-popup',
            options: {
              __data__: data,
              x: x + width - shift,
              y: y + height - shift
            }
          }
        })
      )
    })
    this.addEventListener('mouseleave', function() {
      window.dispatchEvent(
        new CustomEvent('popups-remove', {
          detail: 'module-data-popup'
        })
      )
    })
  }
}