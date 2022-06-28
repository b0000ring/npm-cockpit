import { Page } from './page.js'

export class About extends Page {
  // show info about this app
  constructor() {
    super()

    this.wrapper.innerHTML = 'about'
  }
}