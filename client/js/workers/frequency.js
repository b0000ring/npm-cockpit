onmessage = function(e) {
  const { dependencies } = e.data

  // name@version: count
  const depsCount = {} 

  Object.values(dependencies).flat().forEach(item => {
    item.connections.forEach(node => {
      const namever = node.name + '@' + node.version
      if(!depsCount[namever]) {
        depsCount[namever] = 1
        return
      }
      depsCount[namever] += 1
    })
  })

  // {count: number, data: node}[]
  const result = Object.entries(depsCount).map(item => {
    const [namever, count] = item
    const separator = namever.lastIndexOf('@')
    const name = namever.slice(0, separator)
    const version = namever.slice(separator + 1)
    const data = dependencies[name].find(package => package.version === version)

    return {
      count,
      data
    }
  })
  
  const top10 = result
    .sort((item1, item2) => item2.count - item1.count)
    .slice(0, 10)

  postMessage(top10)
}