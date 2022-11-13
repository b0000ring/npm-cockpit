class Response :
  def __init__(self, type, data, headers = [], status = 200):
    self.type = type
    self.data = data
    self.headers = headers
    self.status = status
  