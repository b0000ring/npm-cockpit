import os

from app.utils import open_json_file, to_dict
from app.classes.Lib import Lib
from app.classes.Error import Error
from app.path import get_package_json_path, get_node_modules_path

# key: name, value: arr of package versions (Lib)
# TODO refactor to be a flat list
data = {}
peer_deps = {}
root = None
max_depth = 0
loaded = False

# TODO refactor this
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

    # getting a package for processing
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
      stack[depth - 2].add_error(Error('circular', current.name, current.version))
      continue

    # adding current lib to result list
    if current.name not in data:
      data[current.name] = [current]
    elif not is_version_exists( data[current.name], current.version):
      data[current.name].append(current)

    #peer dependencies parsing
    if len(current.peerDependencies.keys()):
      for key in current.peerDependencies.keys():
        dep = current.peerDependencies[key]
        if key not in peer_deps: peer_deps[key] = set()
        peer_deps[key].add(dep)

    # dependencies parsing
    child = current.process_dependency()
    
    if child:
      name = child[0]
      version = child[1]
      child_folder_path = name
      
      # if another version already found check local package node_modules
      if name in data and is_local_dependency(current.name, name):
        child_folder_path = current.name + '/node_modules/' + name

      child_path = node_modules_path + '/' + child_folder_path +  '/package.json'
      try:
        child_data = open_json_file(child_path)
        stack.append(Lib(child_data))
      except:
        current.add_error(Error('missing', name, version))
      finally:
        current.add_connection({'name': child_data['name'], 'version': child_data['version']})
    else:
      stack.pop(len(stack) - 1)

def is_version_exists(versions, version):
  return next((item for item in versions if item.version == version), False)

def is_local_dependency(root, name):
  node_modules_path = get_node_modules_path()
  path = node_modules_path + '/' + root + '/node_modules/' + name
  return os.path.isdir(path)

# getting dependencies tree data
def get_dependencies():
  print('Getting project tree...')
  result = {}
  for key in data:
    deps = []
    for l in data[key]:
      deps.append(l.get_data())
    result[key] = deps
  return {
    'root': root.name,
    'dependencies': result,
    'depth': max_depth
  }

def get_issues():
  print('Getting issues data...')
  global data
  result = {}
  for key in data:
    for package in data[key]:
      errors = package.errors
      for error in errors:
        if not error.type in result:
          result[error.type] = {}
        result[error.type][error.lib] = to_dict(error)
  return result