import { Dashboard } from './dashboard.js'
import { Widget } from './widget.js'
import { Popups } from './popups.js'
// widgets
import { 
  Frequency,
  DependenciesTree, 
  Updates, 
  Vulnerabilities,
  UpdatesTable, 
  VulnerabilitiesTable,
  IssuesTable,
  DependenciesNetwork,
  Weight,
  PackageData,
  DependenciesList
} from './items/index.js'

// elements
import { 
  Loading,
  CustomTable,
  DependencyItem,
  VersionItem,
  DependencyVersion,
  DependencyInfo,
  DependencyFilter
} from './elements/index.js'

// popups
import { ModuleDataPopup, GroupDataPopup } from './popups/index.js'

window.customElements.define('npm-dashboard', Dashboard)
window.customElements.define('dashboard-widget', Widget)
window.customElements.define('popups-root', Popups)
window.customElements.define('package-data', PackageData)
window.customElements.define('dependencies-list', DependenciesList)
window.customElements.define('frequency-item', Frequency)
window.customElements.define('dependency-filter', DependencyFilter)
window.customElements.define('weight-item', Weight)
window.customElements.define('vulnerabilities-item', Vulnerabilities)
window.customElements.define('version-item', VersionItem)
window.customElements.define('dependency-version', DependencyVersion)
window.customElements.define('dependency-info', DependencyInfo)
window.customElements.define('dependencies-tree-item', DependenciesTree)
window.customElements.define('dependencies-network-item', DependenciesNetwork)
window.customElements.define('updates-item', Updates)
window.customElements.define('updates-table', UpdatesTable)
window.customElements.define('issues-table', IssuesTable)
window.customElements.define('vulnerabilities-table', VulnerabilitiesTable)
window.customElements.define('loading-element', Loading)
window.customElements.define('dependency-item', DependencyItem)
window.customElements.define('module-data-popup', ModuleDataPopup)
window.customElements.define('group-data-popup', GroupDataPopup)
window.customElements.define('custom-table', CustomTable)
