from app.utils import open_json_file, to_dict
from app.classes.Lib import Lib
from app.classes.Error import Error
from app.path import get_package_json_path, get_node_modules_path

data = {}
peer_deps = {}
root = None
max_depth = 0
loaded = False

def process_dependencies():
  global data
  global root
  global max_depth

  package_json_path = get_package_json_path()
  node_modules_path = get_node_modules_path()

  root_data = open_json_file(package_json_path)
  root = Lib(root_data)
  # updatable
  stack = [root]

  # dependencies tree processing inmplemented with iterative way
  while len(stack):
    depth = len(stack)
  
    # checking and increasing max depth
    if depth > max_depth:
      max_depth = depth

    current = stack[depth - 1]
    found = False

    # prevent from circular dependencies endless cycle
    for prev in stack[:len(stack) - 1]:
      if current.name == prev.name:
        stack.pop(len(stack) - 1)
        found = True
  
    # if circular dependency found then add error object to parent lib
    # and skip next steps
    if found:
      stack[depth - 2].add_error(Error(current.name, 'circular'))
      continue

    # adding current lib to result list
    if current.name not in data:
      data[current.name] = current

    #peer dependencies parsing
    if len(current.peerDependencies.keys()):
      for key in current.peerDependencies.keys():
        dep = current.peerDependencies[key]
        if key not in peer_deps: peer_deps[key] = set()
        peer_deps[key].add(dep)

    # dependencies parsing
    if len(current.dependencies.keys()):
      deps = list(current.dependencies.keys())
      child = deps[0]
      current.dependencies.pop(child, None)
      child_path = node_modules_path + '/' + child + '/package.json'
      try:
        child_data = open_json_file(child_path)
        stack.append(Lib(child_data))
      except:
        current.add_error(Error(child, 'missing'))
      finally:
        current.connections.append(child_data['name'])
    else:
      stack.pop(len(stack) - 1)

# getting dependencies tree data
def get_dependencies():
  print('Getting project tree...')
  result = {}
  for key in data:
    result[key] = to_dict(data[key])
  return {
    'root': root.name,
    'dependencies': result,
    'depth': max_depth
  }

# getting count data by usage data
def get_frequency():
  print('Getting frequency data...')
  global data
  result = {}
  for node in data:
    for dependency in data[node].connections:
      if dependency in result:
        result[dependency]['count'] += 1
      else:
        result[dependency] = {
          'count': 1,
          'data': to_dict(data[dependency])
        }
  return result 

def get_issues():
  print('Getting issues data...')
  global data
  result = {}
  for key in data:
    errors = data[key].errors
    for error in errors:
      if not error.type in result:
        result[error.type] = {}
      result[error.type][error.lib] = to_dict(error)
  return result