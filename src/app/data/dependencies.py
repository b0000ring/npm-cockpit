import os

from src.app.utils import open_json_file, to_dict
from src.app.classes.Lib import Lib
from src.app.classes.Error import Error
from src.app.path import get_package_json_path, get_node_modules_path, get_path

# key: name, value: arr of package versions (Lib)
dependencies = {}
dev_deps = {}
root = None
max_depth = 0
loaded = False

def process_dependencies():
  print('parsing dependencies tree...', flush=True)

  global dependencies
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

    # looking for circular dependency by checking is the same lib already in stack
    circular_dependency_index = find_circular_dependency(stack, current)

    # if circular dependency found put error in the parend and skip parsing this dependency
    if circular_dependency_index is not False:
      parent = stack[circular_dependency_index]
      parent.add_error(Error("circular", current.name, current.version))
      stack.pop()
      continue

    # adding package to packages list
    add_to_dependencies_list(current, dependencies)

    # dependencies parsing
    child = current.process_dependency()
    
    # TODO refactor
    # add check is version exists in array before searching in directories
    # if not processed dependency exist, getting dependency data
    if child:
      name, version = child
      child_folder_path = name
      
      # if another version already found check local package node_modules
      if is_local_dependency(current.path, name):
        child_folder_path = current.path + '/node_modules/' + name

      # path to dependency package.json file 
      child_path = node_modules_path + '/' + child_folder_path +  '/package.json'
      try:
        # getting data from child package.json file
        child_data = open_json_file(child_path)
        # appending child to the stack so its dependencies can be processed next
        stack.append(Lib(child_data, child_folder_path))
        # adding child to current lib connections
        current.add_connection({'name': child_data['name'], 'version': child_data['version']})
      except:
        # if package.json was not found adding error to the current package
        current.add_error(Error('missing', name, version))
    else:
      # removing current package from the stack if it has no unpocessed deps
      stack.pop(len(stack) - 1)
  print('dependencies tree parsed successfully', flush=True)

def is_version_exists(versions, version):
  return next((item for item in versions if item.version == version), False)

def is_local_dependency(current, name):
  node_modules_path = get_node_modules_path()
  path = node_modules_path + '/' + current + '/node_modules/' + name
  return os.path.isdir(path)

def find_circular_dependency(stack, current):
  for i, prev in enumerate(stack[:len(stack) - 1]):
    if current.name == prev.name:
      return i
  return False

def add_to_dependencies_list(current, dependencies):
  if current.name not in dependencies:
    dependencies[current.name] = [current]
  elif not is_version_exists(dependencies[current.name], current.version):
    dependencies[current.name].append(current)

# getting dependencies tree data
def get_dependencies():
  result = {}
  for key in dependencies:
    deps = []
    for l in dependencies[key]:
      deps.append(l.get_data())
    result[key] = deps
  return {
    'root': root.name,
    'dependencies': result,
    'depth': max_depth
  }

def get_issues():
  global dependencies
  result = {}
  for key in dependencies:
    for package in dependencies[key]:
      errors = package.errors
      for error in errors:
        if not error.type in result:
          result[error.type] = {}
        result[error.type][error.name] = to_dict(error)
  return result