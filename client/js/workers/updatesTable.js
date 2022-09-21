onmessage = function(e) {
  const libs = e.data
  const result = []
  Object.entries(libs).forEach(item => {
    const [name, data] = item
    const {current, latest} = data
    let type = ''

    if(!current || !latest) return

    const [currentMajor, currentMinor, currentPatch] = current.split('.').map(num => parseInt(num, 10))
    const [latestMajor, latestMinor, latestPatch] = latest.split('.').map(num => parseInt(num, 10))
  
    if(currentMajor < latestMajor) {
      type = 'major'
    } else if(currentMinor < latestMinor) {
      type = 'minor'
    } else if(currentPatch < latestPatch) {
      type = 'patch'
    }

    result.push({
      name,
      type,
      current,
      latest
    })
  })

  postMessage(result)
}