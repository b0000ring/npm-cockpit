attributes = ['name', 'dependencies', 'author', 'description', 'keywords', 'license', 'repository', 'version']

class Lib:
  def __init__(self, data):
    self.connections = []
    self.dependencies = {}
    for k, v in data.items():
      if(k in attributes):
        setattr(self, k, v)