import copy

from src.app.utils import to_dict

attributes = ['name', 'devDependencies' 'dependencies', 'author', 'description', 'keywords', 'license', 'repository', 'version', 'path']

class Lib:
  def __init__(self, data, path):
    self.errors = []
    self.connections = []
    self.unprocessed_deps = {}
    self.peerDependencies = {}
    self.path = path

    for k, v in data.items():
      if(k in attributes):
        setattr(self, k, v)
      # dev dependencies should be added only for root package because only those are actually installed
      # path == '' means root package (empty node_modules path)
      if k == 'dependencies' or (k == 'devDependencies' and path == ''):
        self.unprocessed_deps.update(copy.deepcopy(v))

  def process_dependency(self):
    if len(self.unprocessed_deps.keys()):
      deps = list(self.unprocessed_deps.keys())
      child = deps[0]
      version = self.unprocessed_deps[child]
      self.unprocessed_deps.pop(child, None)
      return (child, version)

  def add_error(self, error):
    exist = next((item for item in self.errors if item['type'] == error['type'] and item['lib'] == error['lib']), None)

    if not exist:
      self.errors.append(error)
  
  def add_connection(self, data):
    exist = next((item for item in self.connections if item['name'] == data['name']), None)
    if exist:
      return
    self.connections.append(data)

  def get_data(self):
    result = {}
    for k in attributes:
      if self[k]:
        result[k] = self[k]
    result['connections'] = self.connections
    result['errors'] = to_dict(self.errors)
    return result

  def __getitem__(self, item):
    return getattr(self, item, None)