import { Dashboard } from './dashboard.js'
import { DashboardItem } from './dashboard-item.js'
import { Popups } from './popups.js'
// items
import { 
  Frequency,
  DependenciesTree, 
  Updates, 
  Vulnerabilities,
  UpdatesTable, 
  VulnerabilitiesTable,
  IssuesTable,
  DependenciesNetwork
} from './items/index.js'

// elements
import { Loading } from './elements/loading.js'
import { CustomTable } from './elements/table.js'
// popups
import { ModuleDataPopup, GroupDataPopup } from './popups/index.js'

window.customElements.define('npm-dashboard', Dashboard)
window.customElements.define('dashboard-item', DashboardItem)
window.customElements.define('popups-root', Popups)
window.customElements.define('frequency-item', Frequency)
window.customElements.define('vulnerabilities-item', Vulnerabilities)
window.customElements.define('dependencies-tree-item', DependenciesTree)
window.customElements.define('dependencies-network-item', DependenciesNetwork)
window.customElements.define('updates-item', Updates)
window.customElements.define('updates-table', UpdatesTable)
window.customElements.define('issues-table', IssuesTable)
window.customElements.define('vulnerabilities-table', VulnerabilitiesTable)
window.customElements.define('loading-element', Loading)
window.customElements.define('module-data-popup', ModuleDataPopup)
window.customElements.define('group-data-popup', GroupDataPopup)
window.customElements.define('custom-table', CustomTable)
