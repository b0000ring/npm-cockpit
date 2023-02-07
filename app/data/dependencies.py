import os

from app.utils import open_json_file, to_dict
from app.classes.Lib import Lib
from app.classes.Error import Error
from app.path import get_package_json_path, get_node_modules_path, get_path

# key: name, value: arr of package versions (Lib)
data = {}
dev_deps = {}
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
  root = Lib(root_data, '')
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
    for i, prev in enumerate(stack[:len(stack) - 1]):
      if current.name == prev.name:
        stack.pop(len(stack) - 1)
        found = i
  
    # if circular dependency found then add error object to parent lib
    # and skip next steps
    if found != False:
      stack[found].add_error(Error('circular', current.name, current.version))
      continue

    # adding current lib to result list
    if current.name not in data:
      data[current.name] = [current]
    elif not is_version_exists( data[current.name], current.version):
      data[current.name].append(current)

    # dependencies parsing
    child = current.process_dependency()
    
    # TODO refactor
    # add check is version exists in array before searching in directories
    if child:
      name = child[0]
      version = child[1]
      child_folder_path = name
      
      # if another version already found check local package node_modules
      if is_local_dependency(current.path, name):
        child_folder_path = current.path + '/node_modules/' + name

      child_path = node_modules_path + '/' + child_folder_path +  '/package.json'

      try:
        child_data = open_json_file(child_path)
        stack.append(Lib(child_data, child_folder_path))
        current.add_connection({'name': child_data['name'], 'version': child_data['version']})
      except:
        current.add_error(Error('missing', name, version))
        #current.add_connection({'name': name, 'version': ''})
        
    else:
      stack.pop(len(stack) - 1)

def is_version_exists(versions, version):
  return next((item for item in versions if item.version == version), False)

def is_local_dependency(current, name):
  node_modules_path = get_node_modules_path()
  path = node_modules_path + '/' + current + '/node_modules/' + name
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
        result[error.type][error.name] = to_dict(error)
  return result