onmessage = function(e) {
  let count = 0
  let { dependencies, root } = e.data[0]
  dependencies = JSON.parse(JSON.stringify(dependencies))

  const target = e.data[1]
  const network = processNetwork()

  postMessage({
    count,
    network
  })

  function processNetwork() {
    let nodes = []
    // getting flat array of all dependencies
    if(target) {
      // getting network path to target node
      const targetNode = dependencies[target]
      const paths = new Set(targetNode.map(node => findPath(node.name, node.version)).flat())
      nodes = Array.from(paths)
      nodes.push(...targetNode.map(item => {
        item.connections = []
        return item
      }))
    } else {
      // getting first level deps network
      nodes = dependencies[root][0].connections.map(item => dependencies[item.name].find(dep => dep.version === item.version))
      nodes.push(dependencies[root][0])
    }

    // empty links array
    const links = []

    // getting links from dependencies connections
    nodes.forEach((item, i) => {
      // getting all connections for particular dependency
      const connections = item.connections
        .filter(connection => nodes.find(node => node.name === connection.name && node.version === connection.version))
        .map(target => {
          return {
            source: i,
            target: nodes.findIndex(
              // the name and version should match
              item => item.name === target.name && item.version === target.version
            )
          }
      })
      links.push(...connections)
    })

    return {
      nodes,
      links
    }
  }

  function findPath(name, version) {
    const parents = Object.values(dependencies).flat().filter(
        // exclude nodes with corrupted data or circular deps
        item => !item.errors.length && item.connections?.find(
          connection => connection.name === name && connection.version === version
        )
      )

    const ancestors = parents.map(dep => findPath(dep.name, dep.version))
    const result = []

    parents.length && result.push(...parents)
    ancestors.length && result.push(...ancestors)

    return result.flat()
  }
}

