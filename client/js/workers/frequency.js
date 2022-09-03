onmessage = function(e) {
  const dependencies = e.data
  const max = 10
  const result = []
  Object.entries(dependencies).forEach(item => {
    const [, value] = item
    const { count } = value
    if(result.length < max) {
      result.push(item)
      return
    }
    const index = result.findIndex(item => item[1].count < count)
    if(index !== -1) {
      result[index] = item
    }
  })
  postMessage(result)
}