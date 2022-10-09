import sys
import os
import subprocess
import json

from app.utils import open_json_file, to_dict
from app.classes.Lib import Lib
from app.classes.Error import Error

loaded = False
data = {}
updates_data = {}
vulnerabilities_data = {}
root = None
max_depth = 0

try:
  sys.argv[1]
except:
  print('ERROR: Please, provide path to target folder')
  exit()

path = sys.argv[1]
package_json_path = path + '/package.json'
node_modules_path = path + '/node_modules'

isfolder = os.path.isdir(node_modules_path)
isfile = os.path.isfile(package_json_path)

# provided path validation
if not(isfile):
  print('ERROR: Target folder should contain package.json file')
  exit()
if not(isfolder):
  print('ERROR: Target folder should contain node_modules folder')
  exit()

def process_dependencies():
  global data
  global root
  global max_depth

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

def get_updates():
  print('Getting updates data...')
  global updates_data
  if not updates_data:
    command = ['npm', 'outdated', '--json', '--all']
    result = subprocess.run(command, capture_output=True, cwd=path).stdout
    updates_data = json.loads(result)
  return updates_data

def get_vulnerabilities():
  print('Getting vulnerabilities data...')
  global vulnerabilities_data
  if not vulnerabilities_data:
    command = ['npm', 'audit', '--json']
    result = subprocess.run(command, capture_output=True, cwd=path).stdout
    vulnerabilities_data = json.loads(result)
  return vulnerabilities_data

def get_issues():
  print('Getting issues data...')
  result = {}
  for key in data:
    errors = data[key].errors
    for error in errors:
      if not error.type in result:
        result[error.type] = {}
      result[error.type][error.lib] = to_dict(error)
  return result

