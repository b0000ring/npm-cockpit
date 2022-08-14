import json

loaded = False
data = None
tree = None

def get_dependencies():
  print('getting dependencies')

def get_tree():
  print('Getting project tree...')
  return json.load(open('dependencies.json'))

def get_by_frequency():
  print('Getting statistic data...')
  return json.load(open('statistic.json'))