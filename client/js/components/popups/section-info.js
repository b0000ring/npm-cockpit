import { Popup } from './Popup.js'

const infoMap = {
  'package-data': ['This section shows some target application data and general statistical information'],
  'general-info': [
    'This section shows overview of statistical information.',
    'Frequency diagram - shows top 10 most common libraries among all dependencies. As they are big part of dependencies tree they need more attention.',
    'Most dependent diagram - shows top 10 core dependencies which has more their own dependencies. If some core dependency has too many of them, maybe it can be replaced with another one or updated first.',
    'Vulnerabilities diagram - shows how many vulnerabilities with different severities are found.',
    'Updates diagram - shows how many updates of different types are found.'
  ],
  'dependencies-list': [
    'Dependencies list shows all dependencies in a row.',
    'Every dependency row contains list of versions found in dependencies tree.',
    'Row also contains indicators of found states - updates / vulnerabilities found, package is deprecated (click on an indicator to see dependency in a proper section).',
    'To see dependency in the tree or network chart click on a proper icon.',
    'Specific dependency can be found by using dependencies filter.'
  ],
  'updates-list': [
    'Updates list represents all available updates for dependencies in a table.',
    'Updatable column shows is dependency can be updated by running "npm update" command',
    'Table can be filtered by specific dependency name, update type or updatable state by using proper filter.'
  ],
  'vulnerabilities-list': [
    'Vulnerabilities list shows all dependencies for which vulnerablities were found.',
    'Fix available column shows is vulnerability can be fixed by running "npm audit fix" command.',
    'Table can be filtered by specific dependency name, severity or fix availability by using proper filter.'
  ],
  'deprecated-list': [
    'Deprecated list shows all deprecated dependencies which were found in dependencies tree.',
    'To see is some specific dependency deprecated, list can be filtered by using dependency name filter.'
  ],
  'issues-list': [
    'Issues list shows all issues that were found during dependency tree info processing.',
    'It may not have direct impact on the application state, but should be reviewed as may lead to unstable root application behavior or may be the cause of incomplete statistical data.'
  ],
  'dependencies-tree': [
    'Dependencies tree plot shows all found path outcomes to specific depdendency from the root application.',
    'To select target dependency find it by using dependency name filter (to see all the branches where selected dependency is a leaf) or click on any node to see its dependencies.',
    'Hover on a node will show some information for the specific dependency.',
    'It shows all the root dependencies by default.'
  ],
  'dependencies-network': [
    'Dependencies network diagram shows uniq paths form the root application to specific dependency.',
    'To select target dependency find it by using dependency name filter.'
  ]
}

export class SectionInfoPopup extends Popup {
  // TODO refactor
  connectedCallback() {
    const data = this.__data__
    const root = document.createElement('div')
    root.className = 'popup-content'
    
    const body = document.createElement('div')
    body.className = 'popup-body'

    const description = document.createElement('div')
    description.className = 'popup-section'
    const rows = infoMap[data.section]?.map(item => {
      const content = document.createElement('div')
      content.textContent = item
      return content
    })
    description.append(...rows) 

    body.append(description)

    root.append(body)
    this.append(root)

    this.applyCoords(root)
  }
}