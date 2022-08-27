onmessage = function(e) {
  let count = 0
  const { dependencies, root} = e.data[0]
  const { limitation, search } = e.data[1]
  const tree = processTree(dependencies[root], 1)
  postMessage({
    count,
    tree
  });

  function processTree(node, level) {
    const { connections } = node
    const deps = level > limitation ? [] : connections.map(item => {
      const depNode = dependencies[item]
      return processTree(depNode, level + 1)
    }).filter(Boolean)

    if(search && !deps.length && !checkNode(node, search)) {
      return null
    }

    count += 1
    return {
      ...node,
      deps: deps
    }
  }
}

function checkNode(node, value) {
  const { author, name, keywords } = node
  return checkValue(author, value) || checkValue(name, value) || checkValue(keywords, value)
}

function checkValue(field, value) {
  if(!field) return

  if(Array.isArray(field)) {
    return !!field.find(item => item.includes(value))
  }

  if(typeof field === 'object') {
    return !!Object.entries(field).find(entry => entry[1].includes(value))
  }

  return field.includes(value)
}