import json
import sys
import os

loaded = False
data = None
tree = None

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

def process_dependency(name):
  result = []
  dependency_package_file = node_modules_path + '/' + name + '/package.json'
  file_data = json.load(open(dependency_package_file))
  try:
    dependencies = file_data['dependencies']
    for name in dependencies:
      result.append(process_dependency(name))
  finally:
    file_data['dependencies'] = result
    return file_data
  
# main data getting function
def get_dependencies():
  print('getting dependencies')
  global data
  global loaded 
  result = []
  file_data = json.load(open(package_json_path))
  dependencies = file_data['dependencies']
  for name in dependencies:
    result.append(process_dependency(name))

  file_data['dependencies'] = result
  data = file_data
  loaded = True

# getting dependencies tree data
def get_tree():
  print('Getting project tree...')
  return data

# getting statistic data
def get_statistic():
  print('Getting statistic data...')
  return json.load(open('statistic.json'))