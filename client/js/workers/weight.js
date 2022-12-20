onmessage = function(e) {
  const { dependencies, root } = e.data
  const rootDeps = dependencies[root][0].connections

  // name: {count: number, data: obj}
  const result = []

  rootDeps.forEach(rootDep => {
    const {name, version} = rootDep
    const package = dependencies[name].find(item => item.version === version)
    const stack = [package]
    const found = []

    // -1 because the package itself will be also added, but it shouldn't
    let count = -1

    while(stack.length && stack.length) {
      const dep = stack.shift()
      const namever = dep.name + '@' + dep.version
      if(found.includes(namever)) continue;

      const packages = dep.connections.map(item => {
        const {name, version} = item
        return dependencies[name].find(dep => dep.version === version)
      })

      found.push(namever)
      count += 1
      stack.unshift(...packages)
    }

    result.push({
      count,
      data: package
    })
  })  

  postMessage(
    result
      .sort((item1, item2) => item2.count - item1.count)
      .slice(0, 10)
  )
}