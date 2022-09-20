import { Dashboard } from './dashboard.js'
import { DashboardItem } from './dashboard-item.js'
import { Popups } from './popups.js'
// items
import { Frequency, Dependencies, Updates, Vulnerabilities, UpdatesTable } from './items/index.js'
// elements
import { Loading } from './elements/loading.js'
// popups
import { ModuleDataPopup, GroupDataPopup } from './popups/index.js'

window.customElements.define('npm-dashboard', Dashboard)
window.customElements.define('dashboard-item', DashboardItem)
window.customElements.define('popups-root', Popups)
window.customElements.define('frequency-item', Frequency)
window.customElements.define('vulnerabilities-item', Vulnerabilities)
window.customElements.define('dependencies-item', Dependencies)
window.customElements.define('updates-item', Updates)
window.customElements.define('updates-table', UpdatesTable)
window.customElements.define('loading-element', Loading)
window.customElements.define('module-data-popup', ModuleDataPopup)
window.customElements.define('group-data-popup', GroupDataPopup)
