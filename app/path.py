import sys
import os

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

def get_path():
  global path
  return path

def get_package_json_path():
  global package_json_path
  return package_json_path

def get_node_modules_path():
  global node_modules_path
  return node_modules_path