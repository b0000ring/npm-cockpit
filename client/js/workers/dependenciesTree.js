onmessage = function(e) {
  let count = 0
  const { dependencies, root} = e.data[0]
  const { limitation } = e.data[1]
  const tree = processTree(dependencies[root], 1)

  postMessage({
    count,
    tree
  });

  function processTree(node, level) {
    count += 1
    const { connections } = node
    const deps = level > limitation ? [] : connections.map(item => {
      const depNode = dependencies[item]
      const result = processTree(depNode, level + 1)

      return result
    })

    return {
      ...node,
      deps
    }
  }
}

