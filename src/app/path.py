import sys
import os

try:
  sys.argv[1]
except:
  print('ERROR: Please, provide the path to folder with package.json and node_modules', flush=True)
  exit()

path = sys.argv[1]
package_json_path = path + '/package.json'
package_lock_path = path + '/package-lock.json'
node_modules_path = path + '/node_modules'

isNodeModulesFound = os.path.isdir(node_modules_path)
isPackageJSONFound = os.path.isfile(package_json_path)
isPackageLockFound = os.path.isfile(package_lock_path)

# provided path validation
if not(isPackageJSONFound):
  print('ERROR: Target folder should contain package.json file', flush=True)
  exit()
if not(isNodeModulesFound):
  print('ERROR: Target folder should contain node_modules folder', flush=True)
  exit()
if not(isPackageLockFound):
  print('WARNING: package-lock.json not found, cannot get vulnerabilities info', flush=True)

def get_path():
  global path
  return path

def get_package_json_path():
  global package_json_path
  return package_json_path

def get_node_modules_path():
  global node_modules_path
  return node_modules_path