import { Dashboard } from './dashboard.js'
import { DashboardItem } from './dashboard-item.js'
import { Popups } from './popups.js'
// items
import { Frequency, Dependencies, Updates, Vulnerabilities } from './items/index.js'
// elements
import { Loading } from './elements/loading.js'
// popups
import { ModuleDataPopup } from './popups/module-data.js'

window.customElements.define('npm-dashboard', Dashboard)
window.customElements.define('dashboard-item', DashboardItem)
window.customElements.define('popups-root', Popups)
window.customElements.define('frequency-item', Frequency)
window.customElements.define('vulnerabilities-item', Vulnerabilities)
window.customElements.define('dependencies-item', Dependencies)
window.customElements.define('updates-item', Updates)
window.customElements.define('loading-element', Loading)
window.customElements.define('module-data-popup', ModuleDataPopup)
