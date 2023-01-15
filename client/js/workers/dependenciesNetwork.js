onmessage = function(e) {
  let count = 0
  const { dependencies, root } = e.data[0]
  const target = e.data[1]
  const network = processNetwork()

  console.log(target)

  postMessage({
    count,
    network
  })

  function processNetwork() {
    // getting flat array of all dependencies
    const nodes = Object.values(dependencies).map(versions => versions.map(version => ({
      name: version.name,
      data: version
    }))).flat()

    // empty links array
    const links = []

    // getting links from dependencies connections
    nodes.forEach((item, i) => {
      // getting all connections for particular dependency
      const connections = item.data.connections.map(target => {
         return {
          source: i,
          target: nodes.findIndex(
            // the name and version should match
            item => item.name === target.name && item.data.version === target.version
          )
         }
      })
      links.push(...connections)
    })

    // probably target check should be somewhere here

    return {
      nodes,
      links
    }
  }
}