import json

class Processing:

  loaded = False

  tree = None

  # should be added possibility to pass path to porject root
  # def __init__(path):
  #   something...

  def get_tree(self):
    print('Getting project tree...')
    self.tree = json.load(open('data.json'))
