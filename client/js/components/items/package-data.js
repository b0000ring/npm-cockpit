import Item from './Item.js'

export class PackageData extends Item {
  constructor() {
    super('/api/package')
  }

  createSection(title, content) {
    const container = document.createElement('div')
    container.className = 'package-data_section'

    const titleContainer = document.createElement('div')
    titleContainer.className = 'package-data_section_title'
    titleContainer.textContent = title

    container.append(titleContainer, content || '--')
    return container
  }

  render() {
    if(!this.data) {
      return
    }

    const name = this.createSection('Name', this.data.name)
    const description = this.createSection('Description', this.data.description)
    const author = this.createSection('Author', this.data.author)
    const version = this.createSection('Version', this.data.version)
    const repository = this.createSection('Repository', this.data.repository?.url || this.data.repository)
    const license = this.createSection('License', this.data.license)
    const keywords = this.createSection('Keywords', this.data.keywords.join(', '))

    this.append(name, description, author, version, repository, license, keywords)
  }
}