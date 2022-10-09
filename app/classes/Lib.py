attributes = ['name', 'dependencies', 'author', 'description', 'keywords', 'license', 'repository', 'version']

class Lib:
  def __init__(self, data):
    self.errors = []
    self.connections = []
    self.dependencies = {}
    for k, v in data.items():
      if(k in attributes):
        setattr(self, k, v)
  
  def add_error(self, error):
    self.errors.append(error)
  
  def add_connection(self, data):
    if data in self.connections:
      return
    self.connections.append(data)

  def __getitem__(self, item):
    return getattr(self, item, None)