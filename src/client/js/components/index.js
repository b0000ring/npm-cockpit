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
  DependenciesList,
  BasicInfo,
  DeprecatedTable
} from './items/index.js'

// elements
import { 
  Icon,
  CustomTable,
  DependencyItem,
  DependencyVersion,
  DependencyInfo,
  DependencyFilter,
  CustomSelect
} from './elements/index.js'

// popups
import { ModuleDataPopup, GroupDataPopup, SectionInfoPopup } from './popups/index.js'

window.customElements.define('npm-dashboard', Dashboard)
window.customElements.define('dashboard-widget', Widget)
window.customElements.define('popups-root', Popups)
window.customElements.define('package-data', PackageData)
window.customElements.define('basic-info', BasicInfo)
window.customElements.define('dependencies-list', DependenciesList)
window.customElements.define('frequency-item', Frequency)
window.customElements.define('dependency-filter', DependencyFilter)
window.customElements.define('weight-item', Weight)
window.customElements.define('vulnerabilities-item', Vulnerabilities)
window.customElements.define('custom-select', CustomSelect)
window.customElements.define('dependency-version', DependencyVersion)
window.customElements.define('dependency-info', DependencyInfo)
window.customElements.define('dependencies-tree-item', DependenciesTree)
window.customElements.define('dependencies-network-item', DependenciesNetwork)
window.customElements.define('updates-item', Updates)
window.customElements.define('updates-table', UpdatesTable)
window.customElements.define('issues-table', IssuesTable)
window.customElements.define('vulnerabilities-table', VulnerabilitiesTable)
window.customElements.define('icon-element', Icon)
window.customElements.define('dependency-item', DependencyItem)
window.customElements.define('module-data-popup', ModuleDataPopup)
window.customElements.define('section-info-popup', SectionInfoPopup)
window.customElements.define('group-data-popup', GroupDataPopup)
window.customElements.define('custom-table', CustomTable)
window.customElements.define('deprecated-table', DeprecatedTable)

