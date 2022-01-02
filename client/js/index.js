function changeSection(e) {
  const id = e.target.id
  changeActiveMenu(id)
  loadSection(id)
}

function changeActiveMenu(selected) {
  document.querySelector('.active')?.classList.remove('active')
  document.getElementById(selected).classList.add('active')
}

function loadSection(section) {
  const component = document.createElement(`${section}-component`)
  const container = document.querySelector('main')
  container.replaceChildren(component);
}

function init() {
  const navElements = document.getElementsByClassName('nav-link')
  Array.from(navElements).forEach(item => {
    item.onclick = changeSection
  })
  changeActiveMenu('dependencies')
  loadSection('dependencies')
}

init()