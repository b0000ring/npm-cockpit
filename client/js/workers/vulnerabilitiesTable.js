onmessage = function(e) {
  const libs = e.data
  const result = []
  Object.entries(libs).forEach(item => {
    const [name, data] = item
    const {fixAvailable, severity} = data
    
    result.push({
      name,
      // maybe an object
      fixAvailable: (!!fixAvailable).toString(),
      severity
    })
  })

  postMessage(result)
}