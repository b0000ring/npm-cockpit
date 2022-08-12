import { Dashboard } from './dashboard.js'
import { DashboardItem } from './dashboard-item.js'
import { Frequency, Dependencies, Updates } from './items/index.js'
import { Loading } from './elements/loading.js'

window.customElements.define('npm-dashboard', Dashboard)
window.customElements.define('dashboard-item', DashboardItem)
window.customElements.define('frequency-item', Frequency)
window.customElements.define('dependencies-item', Dependencies)
window.customElements.define('updates-item', Updates)
window.customElements.define('loading-element', Loading)
