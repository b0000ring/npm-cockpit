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
  const { dependencies, root} = e.data[0]
  const { limitation, target, path } = e.data[1]
  const tree = processTree(dependencies[root][0], 1)
  postMessage({
    count,
    tree
  })

  function processTree(node, level) {
    const { connections } = node
    let deps = []
    // getting dependencies for node
    if(!(level > limitation) || path[level - 1] === node.name || target) {
      deps = connections.map(item => {
        const { name, version } = item
        const depNode = dependencies[name].find(dep => dep.version === version)
        return processTree(depNode, level + 1)
      }).filter(Boolean)
    } 

    // filtering
    if(target && !deps.length && target !== node.name) {
      return null
    }
  
    // adding errors to tree
    node.errors.forEach(error => deps.push(getError(error)))

    count += 1
    return {
      ...node,
      deps: deps
    }
  }
}

function checkNode(node, value) {
  const { author, name, keywords, version } = node
  return checkValue(author, value) ||
    checkValue(name, value) ||
    checkValue(keywords, value) ||
    checkValue(version, value)
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