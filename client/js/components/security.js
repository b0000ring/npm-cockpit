import { Page } from './page.js'

export class Security extends Page {
  // show table with security issues for dependencies
  // user can click update button to install latest version
  // show warning if this is major version
  constructor() {
    super()

    this.wrapper.innerHTML = 'security'

    this.getData('/api/security').then(() => console.log(this.data))
  }
}