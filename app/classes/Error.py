# types circular/missing/peer
class Error:
  def __init__(self, type, lib, version = '', data = {}):
    self.name = lib
    self.type = type
    self.data = data
    self.version = version

  def __getitem__(self, item):
    return getattr(self, item, None)
