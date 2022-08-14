import json
import sys

loaded = False
data = None
tree = None

# should be param with folder with package.json
print(sys.argv[0])

def get_dependencies():
  print('getting dependencies')

def get_tree():
  print('Getting project tree...')
  return json.load(open('dependencies.json'))

def get_by_frequency():
  print('Getting statistic data...')
  return json.load(open('statistic.json'))