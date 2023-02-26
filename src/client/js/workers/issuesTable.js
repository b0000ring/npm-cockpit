onmessage = function(e) {
  const issues = e.data
  const result = []
  Object.entries(issues).forEach(item => {
    const [, libs] = item
    Object.entries(libs).forEach(lib => {
      const [, data] = lib
      result.push(data)
    })
  })

  postMessage(result)
}