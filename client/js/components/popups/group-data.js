import { Popup } from './Popup.js'

export class GroupDataPopup extends Popup {
  // TODO refactor
  connectedCallback() {
    const data = this.__data__
    const root = document.createElement('div')
    root.className = 'modal-content modal-small'

    const header = document.createElement('div')
    header.className = 'modal-header'
    header.textContent = `${data.name}: ${data.count || 'unknown'}`
    
    const body = document.createElement('div')
    body.className = 'modal-body'

    const description = document.createElement('div')
    description.className = 'modal-section'
    description.textContent = data.description || ''

    body.append(description)

    root.appendChild(header)
    root.appendChild(body)
    this.appendChild(root)

    this.applyCoords(root)
  }
}