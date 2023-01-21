const errorData = {
  circular: {
    label: 'circular',
    description: 'circular dependency in package'
  },
  missing: {
    label: 'missing',
    description: 'package not found in node_modules folder or failed to parse'
  },
  peer: {
    label: 'peer dependency version conflict',
    description: 'package contains peer dependency which was not found in project'
  },
}

onmessage = function(e) {
  let count = 0
  const { dependencies, root, depth} = e.data[0]
  const { target, path } = e.data[1]
  const tree = processTree(dependencies[root][0], 0)
  postMessage({
    count,
    tree
  })

  function processTree(node, level) {
    const { connections } = node
    let deps = []

    // getting dependencies for node
    if(path[level] === node.name || target && (level < depth)) {
      deps = connections.map(item => {
        const { name, version } = item
        const depNode = dependencies[name].find(dep => dep.version === version)
        return processTree(depNode, level + 1)
      }).filter(Boolean)
    }

    // filtering
    if(
      // if target selected and if node is leaf (deps.length is empty)
      // check - is node the target by comparing name, if not exclude node
      // from result
      (target && !deps.length && target !== node.name) || 
      // if path to node selected check - is current depth level is not the final 
      // (by comparing current level and length of path) and then exclude the node 
      // if not in path, by comparing node name by the path value for the node depth level
      (path.length && (level !== path.length && node.name !== path[level]))
    ) {
      return null
    }

    // adding errors if conditions met
    if(
      // if target is set check that current node is the target
      (!target || node.name === target) &&
      // if path is set check that showing node leafs (by checking 
      // that node is the last path element)
      (!path.length || node.name === path[path.length - 1])
    ) {
      node.errors.forEach(error => deps.push(getError(error)))
    }
  
    count += 1

    return {
      ...node,
      deps: deps
    }
  }
}

function getError(error) {
  const type = errorData[error.type].label || error.type
  const description = errorData[error.type].description || ''
  return {
    name: `${error.lib}: ${type} error`,
    description,
    keywords:['error', type],
    error: true
  }
}