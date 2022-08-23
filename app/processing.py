import json
import sys
import os

from app.classes.Lib import Lib

loaded = False
data = {}
root = None

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
  # initial
  global data
  global root
  root_data = json.load(open(package_json_path))
  root = Lib(root_data)
  # updatable
  stack = [root]

  # dependencies tree processing inmplemented with iterative way
  while len(stack) and len(stack) < 100:
    current = stack[len(stack) - 1]
    found = False

    # prevent from circular dependencies endless cycle
    for prev in stack[:len(stack) - 1]:
      if current.name == prev.name:
        stack.pop(len(stack) - 1)
        found = True
    if found:
      continue

    # adding current lib to result list
    if current.name not in data:
      data[current.name] = current
    
    if len(current.dependencies.keys()):
      deps = list(current.dependencies.keys())
      child = deps[0]
      current.dependencies.pop(child, None)
      child_path = node_modules_path + '/' + child + '/package.json'
      try:
        child_data = json.load(open(child_path))
      except:
        child_data = {
          'name': child,
          'description': 'package data not found in node_modules folder'
        }
      current.connections.append(child_data['name'])
      stack.append(Lib(child_data))
    else:
      stack.pop(len(stack) - 1)

# getting dependencies tree data
def get_dependencies():
  print('Getting project tree...')
  result = {}
  for key in data:
    result[key] = data[key].__dict__
  # with open('data.json', 'w', encoding='utf-8') as f:
  #   json.dump(result, f, ensure_ascii=False, indent=4)
  return {
    'root': root.name,
    'dependencies': result
  }

# getting statistic data
def get_statistic():
  print('Getting statistic data...')
  return json.load(open('app/statistic.json'))