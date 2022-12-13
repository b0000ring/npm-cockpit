# types circular/missing/peer
class Error:
  def __init__(self, type, lib, version = '', data = {}):
    self.lib = lib
    self.type = type
    self.data = data
    self.version = version
