# types circular/missing/peer
class Error:
  def __init__(self, lib, type, data = {}):
    self.lib = lib
    self.type = type
    self.data = data
