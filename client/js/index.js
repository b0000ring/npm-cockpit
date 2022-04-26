function changeSection(e) {
  const id = e.target.id
  applyHeader(id)
  changeActiveMenu(e.target)
  loadSection(id)
}

function changeActiveMenu(selected) {
  document.querySelector('.active')?.classList.remove('active')
  selected.classList.add('active')
}

function applyHeader(section) {
  const header = document.querySelector('h1')
  header.replaceChildren(section)
}

function loadSection(section) {
  const component = document.createElement(`${section}-component`)
  const container = document.querySelector('#root')
  container.replaceChildren(component);
}

function init() {
  document.querySelector('.nav').onclick = changeSection

  applyHeader('dependencies')
  loadSection('dependencies')
}

init()