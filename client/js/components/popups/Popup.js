export class Popup extends HTMLElement {
  applyCoords(element) {
    const width = element.offsetWidth
    const height = element.offsetHeight
    let x = this.x
    let y= this.y
    if(x + width > window.innerWidth) {
      x =  window.innerWidth - width - 10
    }
    if(y + height > window.innerHeight) {
      y = window.innerHeight - height - 10
    }
    element.style.top = y
    element.style.left = x
  }
}