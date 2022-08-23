onmessage = function(e) {
  const { dependencies, root} = e.data[0]
  const { limitation } = e.data[1]
  const tree = processTree(dependencies[root], 1)

  postMessage(tree);

  function processTree(node, level) {
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

