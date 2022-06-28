export class Page extends HTMLElement {
  data = null
  
  constructor() {
    super() 

    this.wrapper = document.createElement('div')
    this.wrapper.innerHTML = '<link href="css/bootstrap.min.css" rel="stylesheet">'

    this.attachShadow({mode: 'open'})
    this.shadowRoot.append(this.wrapper)
  }

  async getData(source) {
    this.data = await d3.json(source)
  }
}