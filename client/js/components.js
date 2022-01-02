class Dependencies extends HTMLElement {
  constructor() {
    super()

    const wrapper = document.createElement('div')
    wrapper.innerHTML = 'dependencies'

    this.attachShadow({mode: 'open'});
    this.shadowRoot.append(wrapper);
  }
}

class Security extends HTMLElement {
  constructor() {
    super()

    const wrapper = document.createElement('div')
    wrapper.innerHTML = 'security'

    this.attachShadow({mode: 'open'});
    this.shadowRoot.append(wrapper);
  }
}

class Statistic extends HTMLElement {
  constructor() {
    super()

    const wrapper = document.createElement('div')
    wrapper.innerHTML = 'statistic'

    this.attachShadow({mode: 'open'});
    this.shadowRoot.append(wrapper);
  }
}

class About extends HTMLElement {
  constructor() {
    super()

    const wrapper = document.createElement('div')
    wrapper.innerHTML = 'about'

    this.attachShadow({mode: 'open'});
    this.shadowRoot.append(wrapper);
  }
}

window.customElements.define('dependencies-component', Dependencies)
window.customElements.define('security-component', Security)
window.customElements.define('statistic-component', Statistic)
window.customElements.define('about-component', About)