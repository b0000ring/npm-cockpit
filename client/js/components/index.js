import { About } from './about.js'
import { Dependencies } from './dependencies.js'
import { Security } from './security.js'
import { Statistic } from './statistic.js'

window.customElements.define('dependencies-component', Dependencies)
window.customElements.define('security-component', Security)
window.customElements.define('statistic-component', Statistic)
window.customElements.define('about-component', About)