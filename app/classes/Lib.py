attributes = ['name', 'dependencies', 'author', 'error', 'description', 'keywords', 'license', 'repository', 'version']

class Lib:
  def __init__(self, data):
    self.connections = []
    self.dependencies = {}
    for k, v in data.items():
      if(k in attributes):
        setattr(self, k, v)
  
  def add_connection(self, data):
    if data in self.connections:
      return
    self.connections.append(data)