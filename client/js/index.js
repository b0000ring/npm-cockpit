function switchTheme() {
  if(document.body.className === 'dark') {
    document.body.className = ''
  } else {
    document.body.className = 'dark'
  }
}

function initTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.className = 'dark'
  }
}

window.onload = initTheme