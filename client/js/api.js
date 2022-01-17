window.api = (() => {

  async function get(path) {
    const resp = await fetch(path)
    return resp.json()
  }

  async function getDependencies() {
    const data = await get('/api/dependencies')
    console.log(data)
  }

  async function getSecurity() {
    const data = await get('/api/security')
    console.log(data)
  }

  async function getStatistic() {
    const data = await get('/api/statistic')
    console.log(data)
  }

  return {
    getDependencies,
    getSecurity,
    getStatistic
  }
})()