onmessage = function(e) {
  let count = 0
  const { dependencies } = e.data[0]
  const network = processNetwork()
  postMessage({
    count,
    network
  })

  function processNetwork() {
    nodes = Object.values(dependencies).map(item => ({
      name: item.name,
      data: item
    }))
    links = []
    nodes.forEach((item, i) => {
      const connections = item.data.connections.map(target => {
         return {
          source: i,
          target: nodes.findIndex(item => item.name === target)
         }
      })
      links.push(...connections)
    })

    return {
      nodes,
      links
    }
  }
}