onmessage = function(e) {
  const libs = e.data
  const result = {
    major: 0,
    minor: 0,
    patch: 0
  }
  Object.values(libs).forEach(item => {
    const {current, latest} = item
    
    if(!current || !latest) return

    const [currentMajor, currentMinor, currentPatch] = current.split('.').map(num => parseInt(num, 10))
    const [latestMajor, latestMinor, latestPatch] = latest.split('.').map(num => parseInt(num, 10))
    if(currentMajor < latestMajor) {
      result.major += 1
      return
    }
    if(currentMinor < latestMinor) {
      result.minor += 1
      return
    }
    if(currentPatch < latestPatch) {
      result.patch += 1
      return
    }
  })
  postMessage(result)
}